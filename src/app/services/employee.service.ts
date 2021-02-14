import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Employee } from '../models/Employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeeUrl: string = '/api/v1/employee';

  constructor(private http: HttpClient) {}

  /**
   * Get Employee by employee Id.
   * If employee id is not specified, gets all Employees.
   * @param employeeId
   */
  getEmployee(employeeId = -1): Observable<Employee> | Observable<Employee[]> {
    if (employeeId > 0) {
      let options = {
        headers: this.getAuthHeader(),
        params: new HttpParams({
          fromObject: {
            id: employeeId.toString(),
          },
        }),
      };

      return this.http.get<Employee>(this.employeeUrl, options);
    } else {
      return this.http.get<Employee[]>(this.employeeUrl, {
        headers: this.getAuthHeader(),
      });
    }
  }

  /**
   * Get all Employees by Manager Id.
   * @param id
   */
  getEmployeesByManagerId(id = -1): Observable<Employee[]> {
    if (id > 0) {
      let options = {
        headers: this.getAuthHeader(),
        params: this.getHttpParams({
          manager_id: id,
        }),
      };
      return this.http.get<Employee[]>(this.employeeUrl, options);
    } else {
      throw new Error('Manager_id Invalid');
    }
  }

  /**
   * Create a new Employee.
   * @param employee 
   */
  createEmployee(employee: Employee): Observable<Employee> {
    let options = {
      headers: this.getAuthHeader(),
    };

    return this.http.post<Employee>(this.employeeUrl, employee, options);
  }

  /**
   * If employee exist, updates the changes.
   * If employee does not exist, create new employee.
   * @param employee 
   */
  updateEmployee(employee: Employee): Observable<Employee> {
    let options = {
      headers: this.getAuthHeader(),
    };

    return this.http.put<Employee>(this.employeeUrl, employee, options);
  }

  /**
   * Delete Employee by employee id
   * @param id {id:number}
   */
  deleteEmployee(id: number): Observable<Employee> {
    let options = {
      headers: this.getAuthHeader(),
      params: this.getHttpParams({
        id: id,
      }),
    };

    return this.http.delete<Employee>(this.employeeUrl, options);
  }

  private getAuthHeader(): HttpHeaders {
    if (localStorage.getItem('authToken')) {
      return new HttpHeaders({
        Authorization: localStorage.getItem('authToken'),
      });
    } else {
      return new HttpHeaders();
    }
  }

  private getHttpParams(params: any): HttpParams {
    return new HttpParams({
      fromObject: params,
    });
  }
}
