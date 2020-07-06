import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Login3Component } from './login/login.component';
import { Error1Component } from './error-1/error-1.component';
import { Error2Component } from './error-2/error-2.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { SignUp3Component } from './sign-up/sign-up.component';

const routes: Routes = [
    {
        path: 'login',
        component: Login3Component,
        data: {
            title: 'Login'
        }
    },
    {
        path: 'sign-up',
        component: SignUp3Component,
        data: {
            title: 'Register'
        }
    },
    {
        path: 'forget-password',
        component: ForgetPasswordComponent,
        data: {
            title: 'Forget Password'
        }
    },
    {
        path: 'error-1',
        component: Error1Component,
        data: {
            title: 'Error 1'
        }
    },
    {
        path: 'error-2',
        component: Error2Component,
        data: {
            title: 'Error 2'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthenticationRoutingModule { }
