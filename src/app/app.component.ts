import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'ManagerDashboard';
  public drawerOpen = false;
  public authenticated = false;

  public managerName = "";

  constructor(private authService:AuthenticationService, private router:Router) {
    authService.isAuthenticatedEvent.subscribe(isAuthenticated => {
      this.authenticated = isAuthenticated;
      console.log(this.authenticated + " IS authenticated");
      if(isAuthenticated) {
        let jwt = localStorage.getItem('authToken').substring(7);
        this.managerName = this.authService.getClaimFromJwt(jwt, 'name');
      }
    })
  }

  logout(event) {
    localStorage.removeItem('authToken');
    this.authService.isAuthenticatedEvent.emit(false);
    this.router.navigateByUrl('/login');
  }
}
