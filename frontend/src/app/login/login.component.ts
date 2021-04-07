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
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    if (this.auth.isAuthenticated) {
      this.router.navigateByUrl('/home');
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const user = {
      password: this.loginForm.value.password,
      username: this.loginForm.value.username,
      email: null
    }

    this.loading = true;
    this.auth.authenticateUser(user, false).subscribe((response: any) => {
      this.loading = false;
      if (response.headers.get('x-auth')) {
        const user = { ...response.body, authToken: response.headers.get('x-auth') };
        this.userService.setLoggedInUser(user);
        this.router.navigateByUrl('/home');
        this.auth.onAuthComplete();
      } else {
        this.utils.openSnackBar('Error logging in');
      }
    }, (errorResponse: any) => {
      this.loading = false;
      const errorMessageKey = errorResponse.error.notFound ? 'No user found against the provided credentials' : 'Error logging in';
      this.utils.openSnackBar(errorMessageKey);
    });
  }
}