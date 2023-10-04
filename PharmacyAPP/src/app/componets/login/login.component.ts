import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidateForm from '../../helpers/validateform';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from '../../services/user-store.service';
import { FormsModule } from '@angular/forms';
import { ResetPasswordService } from '../../services/reset-password.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;
  public resetPasswordEmail: string = '';
  public isValidEmail!: boolean;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService,
    private resetService: ResetPasswordService) { }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value)
      this.auth.login(this.loginForm.value)
        .subscribe({
          next: (res) => {
            //alert(res.message)
            this.loginForm.reset();
            this.auth.storeToken(res.accessToken);
            this.auth.storeRefreshToken(res.refreshToken);
            const tokenPayload = this.auth.decodedToken();
            this.userStore.setFullNameForStore(tokenPayload.unique_name);
            this.userStore.setRoleForStore(tokenPayload.role);
            this.toast.success({ detail: "Login SUCCESS", summary: res.message, duration: 7000 });             
            this.router.navigate(['dashboard'])
          },
          error: (err) => {
            //alert(err?.error.message)
           this.toast.error({ detail: "ERROR", summary: "Something whent wrong!", duration: 7000 });
          }
        })


    } else {
      console.log("Form is not valid");

      ValidateForm.validateAllFormFields(this.loginForm);
      alert("Your form is invalid")
    }
  }

  validateEmail(email: string): boolean {
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    return pattern.test(email);
  }

  confirmTosend() {
    if (this.validateEmail(this.resetPasswordEmail)) {
      console.log(this.resetPasswordEmail);
      

      this.resetService.sendResetPasswordLink(this.resetPasswordEmail)
        .subscribe({
          next: (res) => {
            this.toast.success({
              detail: 'Success',
              summary: 'Reset Mail Sended!',
              duration: 3000,
            });
            this.resetPasswordEmail = "";
            const buttonRef = document.getElementById("closeBtn");
            buttonRef?.click();
          },
          error: (err) => {
            this.toast.error({
              detail: 'Error',
              summary: 'Something went wrong',
              duration: 3000,
            });
          }
        })
    }
  }
}


function validateAllFormFields(loginForm: FormGroup<any>) {
    throw new Error('Function not implemented.');
}
