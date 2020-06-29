import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../interfaces/user.type';
import { environment } from 'src/environments/environment';


@Injectable()
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(environment.url + '/cms/supplier/login', { email, password })
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
        return this.http.post<any>(environment.url + '/cms/supplier/generate_otp', { email, otpFor: purpose }).pipe(map(result => {
            return result;
        }));
    }

    // Verify OTP entered
    verifyOtp(code: string, email: string, purpose: string) {
        return this.http.post<any>(environment.url + '/cms/supplier/verify_otp', { email, otpFor: purpose, code }).pipe(map(result => {
            return result;
        }));
    }

    // Register Supplier
    register(data: {}) {
        return this.http.post<any>(environment.url + '/cms/supplier/register', data).pipe(map(result => {
            return result;
        }));
    }

    // Reset password Supplier
    resetPassword(data: {}) {
        return this.http.post<any>(environment.url + '/cms/supplier/reset_password', data).pipe(map(result => {
            return result;
        }));
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}