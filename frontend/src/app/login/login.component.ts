import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AuthenticationService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from '../services/util.service';
import { UserService } from '../services/user.service';
import { constants } from '../app.constants';
import { EmitterService } from '../services/emitter.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  loading = false;
  constants = constants;
  @Output() loginEvent = new EventEmitter();
  @Output() forgotPasswordClicked = new EventEmitter();

  constructor(
    private auth: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private utils: UtilService,
    private userService: UserService,
    private emitter: EmitterService) { }

  ngOnInit() {
    // Intialize Login form
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // If user is logged in then navigate to home
    if (this.auth.isAuthenticated) {
      this.router.navigateByUrl('/home');
    }
  }

  // getter to return form controls
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    // user object to send to the login route of the API
    const user = {
      password: this.loginForm.value.password,
      username: this.loginForm.value.username,
      email: null
    }

    this.loading = true;
    // authenticate the user, in this case the signup flag is set to false
    this.auth.authenticateUser(user, false).subscribe((res: any) => {
      this.loading = false;
      // if response has a user object, it means the login was succesful
      if (res.user) {
        const user = res.user;
        // store user object in the local storage
        this.userService.setLoggedInUser(res.user);
        // navigate to the home
        this.router.navigateByUrl('/home');
        this.auth.onAuthComplete();
      } else {
        this.utils.openSnackBar('Error logging in');
      }
    }, (errorResponse: any) => {
      this.loading = false;
      const errMsg = errorResponse.error.notFound ? 'No user found against the provided credentials' : 'Error logging in';
      this.utils.openSnackBar(errMsg);
    });
  }
}