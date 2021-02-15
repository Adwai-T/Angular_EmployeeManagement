import { Component, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { ShowEmployeesService } from './services/show-employees.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public title = 'ManagerDashboard';
  public drawerOpen = true;
  public authenticated = false;

  public managerName = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private showEmployeeService: ShowEmployeesService
  ) {
    authService.isAuthenticatedEvent.subscribe((isAuthenticated) => {
      this.authenticated = isAuthenticated;
      console.log(this.authenticated + ' IS authenticated');
      if (isAuthenticated) {
        let jwt = localStorage.getItem('authToken').substring(7);
        this.managerName = this.authService.getClaimFromJwt(jwt, 'name');
      }
    });

    if (localStorage.getItem('authToken')) {
      this.authenticated = true;
      let jwt = localStorage.getItem('authToken').substring(7);
      this.managerName = this.authService.getClaimFromJwt(jwt, 'name');

      router.navigateByUrl('/employees');
    }
  }

  showEmployeeByManagerEmail(email): void {
    this.showEmployeeService.getEmployeesByManagerEmail(email);
  }

  showAllEmployees(): void {
    this.showEmployeeService.getAllEmployees();
  }

  showEmployeesByEmailId(email): void {
    this.showEmployeeService.getEmployeeByEmailId(email);
  }

  logout(event): void {
    localStorage.removeItem('authToken');
    this.authService.isAuthenticatedEvent.emit(false);
    this.router.navigateByUrl('/login');
  }
}
