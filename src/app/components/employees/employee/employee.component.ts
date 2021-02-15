import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Employee } from 'src/app/models/Employee';
import { EmployeeService } from 'src/app/services/employee.service';
import { ShowEmployeesService } from 'src/app/services/show-employees.service';
import { EditEmployeeComponent } from '../edit-employee/edit-employee.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  public imageSrc: string;

  @Input() employee: Employee;

  public success: string;
  public error: string;

  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeeService,
    private showEmployeeService: ShowEmployeesService
  ) {}

  ngOnInit(): void {
    //---Profile Image
    if (this.employee.gender === 'male') {
      this.imageSrc = 'assets/images/male.jpg';
    } else if (this.employee.gender === 'female') {
      this.imageSrc = 'assets/images/female.jpg';
    } else {
      this.imageSrc = 'assets/images/generic.png';
    }
  }

  editEmployee() {
    this.dialog.open(EditEmployeeComponent, {
      data: this.employee,
    });
  }

  deleteEmployee() {
    this.employeeService.deleteEmployee(this.employee.id).subscribe(
      (data) => {
        this.showSuccess('Employee Deleted Successfully');
        this.showEmployeeService.getEmployeesForCurrentManager();
      },
      (error) => {
        this.showError('Could not delete Employee, please try again');
      },
      () => {}
    );
  }

  private showError(error) {
    this.error = error;
    setTimeout(() => {
      this.error = '';
    }, 7000);
  }

  private showSuccess(success) {
    this.success = success;
    setTimeout(() => {
      this.success = '';
    }, 7000);
  }
}
