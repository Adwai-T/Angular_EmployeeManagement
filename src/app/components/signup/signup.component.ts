import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ManagerService } from 'src/app/services/manager.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public signupForm:FormGroup;
  public error:string;
  public success:string;

  constructor(private managerService:ManagerService, private router: Router) { }

  ngOnInit(): void {

    this.signupForm = new FormGroup({
      'email' : new FormControl('', Validators.required),
      'password' : new FormControl('', Validators.required),
      'confirmPassword' : new FormControl('', Validators.required),
      'role' : new FormControl({value : 'MANAGER', disabled : true}),
      'name' : new FormControl('', Validators.required)
    })
  }

  createManager() {
    if(this.signupForm.valid) {

      if(this.signupForm.get('password').value === this.signupForm.get('confirmPassword').value) {

        this.signupForm.get('role').setValue('ROLE_MANAGER');
        
        let manager = {
          emailId: this.signupForm.get('email').value,
          name: this.signupForm.get('name').value,
          password: this.signupForm.get('password').value,
          role: this.signupForm.get('role').value,
        }

        this.managerService.createManager(manager).subscribe(
          (data) => {
            this.showSuccess('New Manager created Successfully. \n Login to continue. \n Redirecting...');
          },
          (error) => {
            if(error.status === 409) {
              error = 'Manager with EmailId ' + manager.emailId + ' already exists';
            }else {
              error = 'Internal Server error. Please try again later. Thank you for your patience.'
            }
            this.showError('Error Creating new Manager : ' + error);
          }
        )

      }else {
        this.signupForm.get('password').setValue('');
        this.signupForm.get('confirmPassword').setValue('');
        this.showError("Password and confirmation Password do not match.")
      }
    }else {
      this.showError("All fields are manadatory.");
    }

    this.signupForm.get('role').setValue('MANAGER');
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
      this.router.navigateByUrl('/login');
    }, 3000)
  }

}
