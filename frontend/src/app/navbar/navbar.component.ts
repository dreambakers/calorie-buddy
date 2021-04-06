import { Component, OnInit } from '@angular/core';
import { UtilService } from '../services/util.service';
import { AuthenticationService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user;
  isLoggedIn;
  collapseNavbar = true;

  constructor(
    private auth: AuthenticationService,
    private userService: UserService,
    private utils: UtilService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    this.user = this.userService.getLoggedInUser();
  }

  logout() {
    this.utils.confirmDialog('Are you sure?', 'You will be logged out').subscribe(
      res => {
        if (res) {
          this.auth.logout();
        }
      }
    );
  }

}