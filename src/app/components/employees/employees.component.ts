import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Employee } from 'src/app/models/Employee';
import { ShowEmployeesService } from 'src/app/services/show-employees.service';
import { AddEmployeeComponent } from './add-employee/add-employee.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent implements OnInit, OnDestroy {
  public employees: Employee[];
  public error: string;
  private showEmployeeSubscription: Subscription;

  constructor(
    private showEmployeesService: ShowEmployeesService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.showEmployeeSubscription = this.showEmployeesService.employeesChangeEvent.subscribe(
      (employees) => {
        if (typeof employees == 'object') {
          this.employees = employees;
        } else if (typeof employees == 'number') {
          this.error =
            'There was an Error fetching Employees ( ' +
            employees +
            '). Please try again.';
        } else if (typeof employees == 'string') {
          this.error = employees;
        }
      },
      (error) => {
        this.error =
          'There was an error while fetching employees. Please try again. Thank you for your patience.';
      },
      () => {}
    );

    this.showEmployeesService.getEmployeesForCurrentManager();
  }

  addEmployee() {
    this.dialog.open(AddEmployeeComponent);
  }

  ngOnDestroy(): void {
    this.showEmployeeSubscription.unsubscribe();
  }
}
