import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { User } from '../interfaces/user.type';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Injectable()
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(environment.url + '/login', { email, password })
            .pipe(map(result => {
                if (result.success && result.accessToken) {
                    const user: User = { ...result }
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
                return result;
            }));
    }

    // Send OTP to user email
    generateOTP(email: string, purpose: string) {
        return this.http.post<any>(environment.url + '/generate_otp', { email, otpFor: purpose }).pipe(map(result => {
            return result;
        }));
    }

    // Verify OTP entered
    verifyOtp(code: string, email: string, purpose: string) {
        return this.http.post<any>(environment.url + '/verify_otp', { email, otpFor: purpose, code }).pipe(map(result => {
            return result;
        }));
    }


     // Register Supplier
     register(data: {}) {
        return this.http.post<any>(environment.url + '/register', data).pipe(map(result => {
            return result;
        }));
    }

    // Reset password Supplier
    resetPassword(data: {}) {
        return this.http.post<any>(environment.url + '/reset_password', data).pipe(map(result => {
            return result;
        }));
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/authentication/login']);
    }

    refreshToken() {
        const refreshToken = this.currentUserValue.refreshToken;
        return this.http.post<any>(environment.url + '/token', { refreshToken }).pipe(tap((result: any) => {
            if (result.success) {
                const userValue = this.currentUserValue;
                userValue.accessToken = result.accessToken;
                localStorage.removeItem('currentUser');
                this.currentUserSubject.next(null);
                localStorage.setItem('currentUser', JSON.stringify(userValue));
                this.currentUserSubject.next(userValue);
            }
        }));
    }
}