import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private auth: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  // return authentication status so that we can decide to show the add food tab or not
  get isAuthenticated() {
    return this.auth.isAuthenticated;
  }

}
