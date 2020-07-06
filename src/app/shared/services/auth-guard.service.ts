import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(public auth: AuthenticationService, public router: Router) { }
    canActivate(): boolean {
        if (!this.auth.currentUserValue) {
            this.router.navigate(['/authentication/login']);
            return false;
        }
        return true;
    }

}