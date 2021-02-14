import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthRequestBody } from '../models/AuthRequestBody';
import { AuthResponseBody } from '../models/AuthResponseBody';
import { JwtBody } from '../models/JwtBody';
import { Manager } from '../models/Manager';
import { ManagerService } from './manager.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private authUrl: string = '/authenticate';
  public isAuthenticatedEvent: EventEmitter<boolean> = new EventEmitter();
  public authenticatedManager: EventEmitter<Manager> = new EventEmitter();

  constructor(private http: HttpClient, private managerService: ManagerService) {}

  /**
   * Authenticate with credentials and emit authenticated manager.
   * @param credentials:AuthRequestBody
   */
  public authenticate(credentials: AuthRequestBody) :Observable<AuthResponseBody>{
    return this.http.post<AuthResponseBody>(this.authUrl, credentials);
  }

  /**
   * Clears Auth data from localStorage and emits isAuthenticated event.
   */
  public logout() {
    localStorage.removeItem("authToken");
    this.isAuthenticatedEvent.emit(false);
  }

  //--- JWT Utilities
  //All of these methods are for convenience and do not actually check validity of signed key.
  //Use them trivial functionality and not for permissions.
  checkJwtNotExpired(jwt: string): boolean {
    let jwtArray = jwt.split('.');
    let jwtData: JwtBody = JSON.parse(atob(jwtArray[1]));

    return Math.round(new Date().getTime() / 1000) < jwtData.exp;
  }

  getClaimFromJwt(jwt: string, key:string): string {
    let jwtArray = jwt.split('.');
    let jwtData: JwtBody = JSON.parse(atob(jwtArray[1]));
    return jwtData[key];
  }
}
