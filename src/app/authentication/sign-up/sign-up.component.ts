import { Component } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

const OTP_FOR = 'REGISTER';
@Component({
    templateUrl: './sign-up.component.html',
    styles: [
        `.phone-select {
        width: 140px;
      }`
    ]
})

export class SignUp3Component {

    signUpForm: FormGroup;
    emailForm: FormGroup;
    verificationCodeForm: FormGroup;
    currentStep: number = 0;
    isVerifingEmail: boolean = false;
    isResending: boolean = false;
    isVerifyingCode: boolean = false;
    isRegistering: boolean = false;
    countryCodes: any[] = [];

    countries: any[] = [{ prefix: '+255', country: 'Tanzania', code2: 'TZ' }, { prefix: '+254', country: 'Kenya', code2: 'KE' }];
    selectedCountry: any = this.countries[0].code2;

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
                if (this.signUpForm.valid) {
                    this.submitUserDetails(this.signUpForm.value);
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
                this.signUpForm.patchValue({ email });
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
                this.signUpForm.patchValue({ email });
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
                this.signUpForm.patchValue({ verificationId: result.verificationId });
                this.notification.success('Verification Successful', 'Successfully verified your email.');
                this.nextStep();
            } else {
                this.notification.error('Error', result.message);
            }
        });
    }

    submitUserDetails(info: any) {
        this.isRegistering = !this.isRegistering;
        this.authService.register(info).subscribe((result) => {
            this.isRegistering = !this.isRegistering;
            if (result.success) {
                this.notification.success('Successfully Created Account', 'An email will be sent to you once verification completes.');
                // Redirect to login Screen
                this.router.navigate(['/authentication/login']);
            } else {
                this.notification.error('Error', result.message);
            }
        });
    }

    updateConfirmValidator(): void {
        Promise.resolve().then(() => this.signUpForm.controls.checkPassword.updateValueAndValidity());
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.signUpForm.controls.password.value) {
            return { confirm: true, error: true };
        }
    }

    constructor(private fb: FormBuilder, private authService: AuthenticationService, private notification: NzNotificationService, private router: Router) {
    }

    ngOnInit(): void {

        this.getCountryCodes();

        this.emailForm = this.fb.group({
            email: [null, [Validators.required, Validators.email]],
        });

        this.verificationCodeForm = this.fb.group({
            verificationCode: [null, [Validators.required, Validators.minLength(6)]],
        });
        this.signUpForm = this.fb.group({
            name: [null, [Validators.required]],
            countryCode: [],
            phoneNumber: [null, [Validators.required]],
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required]],
            confirmPassword: [null, [Validators.required, this.confirmationValidator]],
            verificationId: [null, [Validators.required]],
            // agree: [false]
        });
    }

    nextStep(): void {
        this.currentStep++;
    }

    getCountryCodes() {
        this.authService.getCountryCodes().subscribe((response) => {
            this.countryCodes = response.data;
        });
    }
}    