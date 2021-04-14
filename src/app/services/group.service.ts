import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  URL_REPORT_SERVER = environment.reportServerUrl;
  url = `${this.URL_REPORT_SERVER}/group`;

  constructor(private http: HttpClient) { }

  async getAll() {
    return await this.http.get<any>(this.url)
      .toPromise()
      .then(res  => res);
  };

  async createNewGroup(params) {
    return await this.http.post(this.url, {...params}).toPromise()
    .then(res => res);
  }

  async editGroup(params) {
    return await this.http.put(this.url, {...params}).toPromise()
    .then(res => res);
  }

  async removeGroup(groupId) {
    const deleteUrl = `${this.url}/${groupId}`
    return await this.http.delete(deleteUrl).toPromise()
    .then(res => res);
  }
}
