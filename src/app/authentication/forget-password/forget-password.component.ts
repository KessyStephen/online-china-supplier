import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

const OTP_FOR = 'RESET';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;
  emailForm: FormGroup;
  verificationCodeForm: FormGroup;
  currentStep: number = 0;
  isVerifingEmail: boolean = false;
  isResending: boolean = false;
  isVerifyingCode: boolean = false;
  isResetting: boolean = false;

  countries: any[] = [{ prefix: '+255', country: 'Tanzania', code: 'TZ' }, { prefix: '+254', country: 'Kenya', code: 'KE' }];
  selectedCountry: any = this.countries[0].code;

  submitForm(): void {
    switch (this.currentStep) {
      case 0:
        if (this.emailForm.valid) {
          this.verifyEmailAddress(this.emailForm.get('email').value, OTP_FOR);
        }
        break;

      case 1:
        if (this.verificationCodeForm.valid) {
          this.verifyCode(this.verificationCodeForm.get('verificationCode').value, this.emailForm.get('email').value, OTP_FOR);
        }
        break;

      case 2:
        if (this.forgetPasswordForm.valid) {
          this.submitResetDetails(this.forgetPasswordForm.value);
        }
        break;

      default:
        break;
    }
  }

  verifyEmailAddress(email: string, otpFor: string): void {
    this.isVerifingEmail = !this.isVerifingEmail;
    this.authService.generateOTP(email, otpFor).subscribe((result) => {
      this.isVerifingEmail = !this.isVerifingEmail;
      if (result.success) {
        this.forgetPasswordForm.patchValue({ email });
        this.notification.success('Verification Code sent', 'Please verify your identity by entering the verification code from your email address.');
        this.nextStep();
      } else {
        this.notification.error('Error', result.message);
      }
    });
  }

  resendOTP() {
    this.isResending = !this.isResending;
    const email = this.emailForm.get('email').value;
    const otpFor = OTP_FOR;
    this.authService.generateOTP(email, otpFor).subscribe((result) => {
      this.isResending = !this.isResending;
      if (result.success) {
        this.forgetPasswordForm.patchValue({ email });
        this.notification.success('Verification Code sent', 'Successfully resent OTP to your email address.');
      } else {
        this.notification.error('Error', result.message);
      }
    });
  }

  verifyCode(code: string, email: string, otpFor: string): void {
    this.isVerifyingCode = !this.isVerifyingCode;
    this.authService.verifyOtp(code, email, otpFor).subscribe((result) => {
      this.isVerifyingCode = !this.isVerifyingCode;
      if (result.success) {
        this.forgetPasswordForm.patchValue({ verificationId: result.verificationId });
        this.notification.success('Verification Successful', 'Successfully verified your email.');
        this.nextStep();
      } else {
        this.notification.error('Error', result.message);
      }
    });
  }

  submitResetDetails(info: any) {
    this.isResetting = !this.isResetting;
    this.authService.resetPassword(info).subscribe((result) => {
      this.isResetting = !this.isResetting;
      if (result.success) {
        this.notification.success('Password Ressetted', 'Successfully resetted your password. Please login with the new credentials.');
        // Redirect to login Screen
        this.router.navigate(['/authentication/login']);
      } else {
        this.notification.error('Error', result.message);
      }
    });
  }

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.forgetPasswordForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.forgetPasswordForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  }

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private notification: NzNotificationService, private router: Router) {
  }

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });

    this.verificationCodeForm = this.fb.group({
      verificationCode: [null, [Validators.required, Validators.minLength(6)]],
    });

    this.forgetPasswordForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required, this.confirmationValidator]],
      verificationId: [null, [Validators.required]],
    });
  }

  nextStep(): void {
    this.currentStep++;
  }
}    