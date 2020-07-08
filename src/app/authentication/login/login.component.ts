import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';


@Component({
    templateUrl: './login.component.html'
})

export class Login3Component {
    loginForm: FormGroup;
    isLoggingIn: boolean = false;

    submitForm(): void {
        if (this.loginForm.valid) {
            const email = this.loginForm.get('email').value;
            const password = this.loginForm.get('password').value;
            this.login(email, password)
        }
    }

    login(email, password) {
        this.isLoggingIn = !this.isLoggingIn;
        this.authService.login(email, password).subscribe((result: any) => {
            this.isLoggingIn = !this.isLoggingIn;
            if (result.success) {
                // Redirect to dashboard Screen
                this.router.navigate(['/dashboard']);
                this.notification.success(`Hi ${this.authService.currentUserValue.name}`, 'Welcome Back!');
            } else {
                this.notification.error('Error', result.message);
            }
        });
    }

    constructor(private fb: FormBuilder, private authService: AuthenticationService, private notification: NzNotificationService, private router: Router) {
    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required]]
        });
    }
}    