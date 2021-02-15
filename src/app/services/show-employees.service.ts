import { EventEmitter, Injectable } from '@angular/core';
import { Employee } from '../models/Employee';
import { AuthenticationService } from './authentication.service';
import { EmployeeService } from './employee.service';

@Injectable({
  providedIn: 'root',
})
export class ShowEmployeesService {
  public employeesChangeEvent: EventEmitter<Employee[]|string|number> = new EventEmitter();

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthenticationService
  ) {}

  public getEmployeesForCurrentManager(): void{
    if (localStorage.getItem('authToken')) {
      let manager_id = this.authService.getClaimFromJwt(
        localStorage.getItem('authToken').substring(7),
        'id'
      );
      this.employeeService
        .getEmployeesByManagerId(parseInt(manager_id))
        .subscribe(
          (data) => {
            this.employeesChangeEvent.emit(data);
          },
          (error) => {
            this.employeesChangeEvent.emit(error.status);
          },
          () => {}
        );
    }else {
      this.employeesChangeEvent.emit("Error could not get Employees. Please try again later.");
    }
  }

  public getEmployeesByManagerEmail(email:string) :void {
    this.employeeService.getEmployeesByManagerEmailId(email).subscribe(
      (data) => {
        this.employeesChangeEvent.emit(data);
      },
      (error) => {
        this.employeesChangeEvent.emit(error.status);
      },
      () => {}
    );
  }

  public getEmployeeByEmailId(email) :void {
    this.employeeService.getEmployeesByEmailId(email).subscribe(
      (data) => {
        let employeeArray:Employee[] = [];
        employeeArray.push(data);
        this.employeesChangeEvent.emit(employeeArray);
      },
      (error) => {
        this.employeesChangeEvent.emit(error.status);
      },
      () => {}
    );
  }

  public getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe(
      (data) => {
        this.employeesChangeEvent.emit(data);
      },
      (error) => {
        this.employeesChangeEvent.emit(error.status);
      },
      () => {}
    ) 
  }
}
