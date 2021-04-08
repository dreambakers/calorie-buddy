import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UtilService } from '../services/util.service';
import { UserService } from '../services/user.service';
import { constants } from '../app.constants';
import { EmitterService } from 'src/app/services/emitter.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  submitted = false;
  constants = constants;
  loading = false;
  @Output() signupEvent = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private router: Router,
    private utils: UtilService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    // Intialize signup form
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'), Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  // getter to return form controls
  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.signupForm.invalid) {
      return;
    }

    // user object to send to signup route of API
    const user = {
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      username: this.signupForm.value.username
    }

    this.loading = true;
    // authenticate the user, in this case the signup flag is set to true
    this.auth.authenticateUser(user, true).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.body.email) {
          const user = res.body;
           // store user object in the local storage
          this.userService.setLoggedInUser(user);
          this.router.navigateByUrl('/home');
          this.auth.onAuthComplete();
        } else {
          this.utils.openSnackBar('Error signing up');
        }
      },
      errorResponse => {
        this.loading = false;
        if (errorResponse.error.alreadyExists) {
          if (errorResponse.error.username) {
            this.signupForm.controls['username'].setErrors({'usernameExists': true});
          }
          if (errorResponse.error.email) {
            this.signupForm.controls['email'].setErrors({'emailExists': true});
          }
          return;
        }
        this.utils.openSnackBar('Error signing up');
      }
    );
  }

}
