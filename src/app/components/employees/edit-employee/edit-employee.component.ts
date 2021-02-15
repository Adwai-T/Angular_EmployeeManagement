import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Employee } from 'src/app/models/Employee';
import { EmployeeService } from 'src/app/services/employee.service';
import { ShowEmployeesService } from 'src/app/services/show-employees.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
})
export class EditEmployeeComponent implements OnInit {
  public editEmployeeForm: FormGroup;
  public error: string;
  public success: string;

  constructor(
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: Employee,
    private showEmployeeService: ShowEmployeesService
  ) {}

  ngOnInit(): void {
    this.editEmployeeForm = new FormGroup({
      name: new FormControl(this.data.name, Validators.required),
      email: new FormControl(this.data.emailId, Validators.required),
      salary: new FormControl(this.data.salary, Validators.required),
      role: new FormControl(
        { value: this.data.role, disabled: true },
        Validators.required
      ),
      joining: new FormControl(this.data.joiningDate, Validators.required),
      gender: new FormControl(this.data.gender, Validators.required),
    });
  }

  editEmployee() {
    if (this.editEmployeeForm.valid) {
      let employee: Employee = {
        emailId: this.editEmployeeForm.get('email').value,
        name: this.editEmployeeForm.get('name').value,
        salary: this.editEmployeeForm.get('salary').value,
        role: this.editEmployeeForm.get('role').value,
        joiningDate: this.editEmployeeForm.get('joining').value,
        gender: this.editEmployeeForm.get('gender').value.toLowerCase(),
      };

      this.employeeService.updateEmployee(employee).subscribe(
        (data) => {
          this.showEmployeeService.getEmployeesForCurrentManager();
        },
        (error) => {
          this.showError('Could not create Employee : ' + error.status);
        },
        () => {}
      );
    } else {
      this.showError('All fields are manadatory.');
    }
  }

  private showError(error) {
    this.error = error;
    setTimeout(() => {
      this.error = '';
    }, 7000);
  }
}
