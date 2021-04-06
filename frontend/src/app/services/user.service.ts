import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
  ) { }

  getLoggedInUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  getAuthToken() {
    return (this.getLoggedInUser() && this.getLoggedInUser()['authToken']) || '';
  }

  setLoggedInUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getPreferences() {
    return JSON.parse(localStorage.getItem('preferences'));
  }

  unsetLoggedInUser() {
    localStorage.removeItem('user');
  }
}
