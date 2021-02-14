import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Manager } from '../models/Manager';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  private managerUrl: string = '/api/v1/manager';

  constructor(private http: HttpClient) {}

  /**
   * Get authenticated manager if id is not provided or get manager by id.
   * @param id { number }
   */
  getManager(id = ''): Observable<Manager> {
    let url = this.managerUrl;
    if (id != '') {
      url += '/' + id;
    }

    let jwt = localStorage.getItem('authToken');
    if (jwt) {
      let options = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('authToken'),
        }),
      };

      return this.http.get<Manager>(url, options);
    } else {
      throw new Error('AuthToken not present in local storage, please login.');
    }
  }

  /**
   * Updates Manager if already exist, and creates a new manager if does not exist.
   * @param manager { Manager }
   */
  putManager(manager: Manager): Observable<Manager> {
    let url = this.managerUrl + '/update';
    return this.http.put<Manager>(url, manager, this.getHttpOptions());
  }

  /**
   * Delete authorized manager.
   */
  deleteManager(): Observable<Manager> {
    return this.http.delete<Manager>(this.managerUrl, this.getHttpOptions());
  }

  /**
   * Create a new Manager.
   * @param manager
   */
  createManager(manager: Manager): Observable<Manager> {
    let url = this.managerUrl + '/create';
    return this.http.post<Manager>(url, manager);
  }

  private getHttpOptions(): object {
    let options;
    if (localStorage.getItem('authToken')) {
      options = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('authToken'),
        }),
      };
    } else {
      options = {

      }
    }
    return options;
  }
}
