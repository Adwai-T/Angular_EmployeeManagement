import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthRequestBody } from 'src/app/models/AuthRequestBody';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm:FormGroup;
  public error:string = "";
  public success:string = "";

  constructor(private authService:AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email' : new FormControl('', Validators.required),
      'password' : new FormControl('', Validators.required)
    })
  }

  public authenticate():void {
    if(this.loginForm.valid) {

      let credentials: AuthRequestBody = {
        emailId : this.loginForm.get('email').value,
        password : this.loginForm.get('password').value,
      }

      this.authService.authenticate(credentials).subscribe(body => {
        localStorage.setItem("authToken", ("Bearer " + body.jwt));
        this.authService.isAuthenticatedEvent.emit(true);
        this.router.navigateByUrl('/employees');
      },
      error => {
        if(error.status === 403) {
          error = "Email-Id or Password wrong."
        }else {
          error = "There was a problem loggin in, Please try again later."
        }
        let errorString = "Login Failed : " + error;
        this.showError(errorString);
      });  
    }else {
      this.showError("All fields are required.")
    }
  }

  private showError(error) {
    this.error = error;
    setTimeout(()=> {
      this.error = "";
    }, 7000);
  }

  private successMessage(success) {
    this.success = success;
  }
}
