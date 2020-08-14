import {Injectable} from '@angular/core';

import {HTTPService} from './http.service';

import {ConfigService} from './config.service';

import {BehaviorSubject, throwError} from 'rxjs';

import {User} from '../models/user.model';

import {catchError, tap} from 'rxjs/operators';

import {HttpErrorResponse} from '@angular/common/http';

import {SidebarService} from './sidebar.service';

import {environment} from 'src/environments/environment';

import {MapService} from './map.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    authConfig;

    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(
        private hTTPService: HTTPService,
        private configService: ConfigService,
        private sidebarService: SidebarService,
        private mapService: MapService
    ) {
        this.authConfig = this.configService.getAuthConfig();
    }

    login(params) {
        return this.hTTPService.postTerrama(this.authConfig.url, params)
            .pipe(
                catchError(this.handleError),
                tap(resData => this.handleAuthentication(resData['user']))
            );
    }

    autoLogin() {
        const userData: {
            id: number;
            name: string;
            email: string;
            username: string;
            administrator: boolean;
            tokenCode: string;
            tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.id,
            userData.name,
            userData.email,
            userData.username,
            userData.administrator,
            userData.tokenCode,
            new Date(userData.tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.user.next(loadedUser);
            this.mapService.reportTableButton.next(true);
            const expirationDuration =
                new Date(userData.tokenExpirationDate).getTime() -
                new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        this.user.next(null);
        this.mapService.reportTableButton.next(false);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
        this.sidebarService.sidebarReload.next();
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => this.logout(), expirationDuration);
        this.sidebarService.sidebarReload.next();
    }

    private handleAuthentication(loggedUser) {
        if (!loggedUser) {
            return false;
        }
        let expiresIn = this.authConfig.expiresIn;
        if (!environment.production) {
            expiresIn = 31536000;
        }
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(
            loggedUser.id,
            loggedUser.name,
            loggedUser.email,
            loggedUser.username,
            loggedUser.administrator,
            loggedUser.token,
            expirationDate);
        this.user.next(user);
        this.mapService.reportTableButton.next(true);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(error: HttpErrorResponse) {
        return throwError(`Error occured: ${error.message}`);
    }

}
