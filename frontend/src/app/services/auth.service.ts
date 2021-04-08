import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { constants } from '../app.constants';
import { UserService } from './user.service';
import { EmitterService } from './emitter.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated = this.userService.getLoggedInUser() ? true : false;
  constants = constants;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private emitterService: EmitterService,
    private util: UtilService
  ) { }

  authenticateUser(user: { email, password, username }, signUp = false) {
    let requestUrl = `${constants.apiUrl}/user`;

    if (signUp) {
      requestUrl += '/'
    }
    else {
      requestUrl += '/login'
    }

    return this.http.post(requestUrl, user, {observe: 'response'});
  }

  logout() {
    this.http.post(`${constants.apiUrl}/user/logout`, {}).subscribe();
    this.userService.unsetLoggedInUser();
    this.router.navigateByUrl('login');
    this.onLogout();
  }

  onAuthComplete() {
    this.emitterService.emit(this.constants.emitterKeys.onAuthComplete);
    this.isAuthenticated = true;
    this.util.openSnackBar('You are now logged in!');
  }

  onLogout() {
    this.isAuthenticated = false;
    this.util.openSnackBar('Successfully logged out!');
  }

}
