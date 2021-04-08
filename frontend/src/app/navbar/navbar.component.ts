import { Component, OnDestroy, OnInit } from '@angular/core';
import { UtilService } from '../services/util.service';
import { AuthenticationService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { EmitterService } from '../services/emitter.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { constants } from '../app.constants';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  user;
  collapseNavbar = true;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private auth: AuthenticationService,
    private userService: UserService,
    private utils: UtilService,
    private emitterService: EmitterService
  ) { }


  ngOnInit() {
    this.user = this.userService.getLoggedInUser();
    // this emitter listens for auth process completion. in that case, the user object is updated by picking from the local storage
    this.emitterService.emitter.pipe(takeUntil(this.destroy$)).subscribe((emitted) => {
      switch(emitted.event) {
        case constants.emitterKeys.onAuthComplete:
          // set local user object to the one stored in local storage
          return this.user = this.userService.getLoggedInUser();
      }
    });
  }

  logout() {
    this.toggleNavbar();
    this.utils.confirmDialog('Are you sure?', 'You will be logged out').subscribe(
      res => {
        if (res) {
          this.auth.logout();
        }
      }
    );
  }

  toggleNavbar() {
    this.collapseNavbar = !this.collapseNavbar;
  }

  get isAuthenticated() {
    return this.auth.isAuthenticated;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}