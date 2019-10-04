import { ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle } from '@angular/router';

interface RouteStorageObject {
    snapshot: ActivatedRouteSnapshot;
    handle: DetachedRouteHandle;
}

export class CustomReuseStrategy implements RouteReuseStrategy {
    storedRoutes: { [key: string]: RouteStorageObject } = {};

    private acceptedRoutes: string[] = ['/map'];

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        if (this.acceptedRoutes.indexOf(route.routeConfig.path) > -1) {
            return true;
        } else {
            return false;
        }
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        const storedRoute: RouteStorageObject = {
            snapshot: route,
            handle
        };

        this.storedRoutes[route.routeConfig.path] = storedRoute;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const canAttach: boolean = !!route.routeConfig && !!this.storedRoutes[route.routeConfig.path];

        if (canAttach) {
            const paramsMatch = this.compareObjects(route.params, this.storedRoutes[route.routeConfig.path].snapshot.params);
            const queryParamsMatch = this.compareObjects(route.queryParams, this.storedRoutes[route.routeConfig.path].snapshot.queryParams);

            return paramsMatch && queryParamsMatch;
        } else {
            return false;
        }
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        if (!route.routeConfig || !this.storedRoutes[route.routeConfig.path]) {
            return null;
        }
        return this.storedRoutes[route.routeConfig.path].handle;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

    private compareObjects(base: any, compare: any): boolean {
        for (const baseProperty in base) {
            if (compare.hasOwnProperty(baseProperty)) {
                switch (typeof base[baseProperty]) {
                    case 'object':
                        if (typeof compare[baseProperty] !== 'object' ||
                            !this.compareObjects(base[baseProperty], compare[baseProperty])) {
                                return false;
                            }
                        break;
                    case 'function':
                        if (typeof compare[baseProperty] !== 'function' ||
                            base[baseProperty].toString() !== compare[baseProperty].toString()) {
                                return false;
                            }
                        break;
                    default:
                        if (base[baseProperty] !== compare[baseProperty]) {
                            return false;
                        }
                }
            } else {
                return false;
            }
        }
        return true;
    }
}
