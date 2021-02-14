import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { EmployeesComponent } from './components/employees/employees.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    children: [],
  },
  {
    path: 'signup',
    component: SignupComponent,
    children: [],
  },
  {
    path: 'employees',
    component: EmployeesComponent,
    children: [],
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
