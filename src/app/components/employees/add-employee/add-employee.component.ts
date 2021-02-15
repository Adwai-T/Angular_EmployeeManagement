import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Employee } from 'src/app/models/Employee';
import { EmployeeService } from 'src/app/services/employee.service';
import { ShowEmployeesService } from 'src/app/services/show-employees.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {

  public editEmployeeForm:FormGroup;
  public error:string;
  public success:string;

  constructor(private employeeService:EmployeeService, private showEmployeeService:ShowEmployeesService) { }

  ngOnInit(): void {
    this.editEmployeeForm = new FormGroup({
      'name' : new FormControl('', Validators.required),
      'email' : new FormControl('', Validators.required),
      'salary' : new FormControl('', Validators.required),
      'role' : new FormControl({value : 'ROLE_EMPLOYEE', disabled: true}, Validators.required),
      'joining' : new FormControl('', Validators.required),
      'gender' : new FormControl('', Validators.required)
    })
  }

  editEmployee() {
    if(this.editEmployeeForm.valid) {
      let employee:Employee = {
        emailId: this.editEmployeeForm.get('email').value,
        name: this.editEmployeeForm.get('name').value,
        salary: this.editEmployeeForm.get('salary').value,
        role: this.editEmployeeForm.get('role').value,
        joiningDate: this.editEmployeeForm.get('joining').value,
        gender: this.editEmployeeForm.get('gender').value.toLowerCase(),
      }

      this.employeeService.createEmployee(employee).subscribe(
        (data) => {
          this.showSuccess('Employee added successfully, continue to add new Employees.')
          this.editEmployeeForm.reset();
          this.showEmployeeService.getEmployeesForCurrentManager();
        },
        (error) => {
          if(error.status === 409) {
            this.showError("Employee with email Id already exists.")
          }else {
            this.showError("Could not create Employee : " + error.status);
          }
        },
        () => {}
      )
    }else {
      this.showError("All fields are manadatory.")
    }
  }

  private showError(error) {
    this.error = error;
    setTimeout(()=> {
      this.error = "";
    }, 7000);
  }

  private showSuccess(success) {
    this.success = success;
    setTimeout(()=>{
      this.success = "";
    }, 7000)
  }
}
