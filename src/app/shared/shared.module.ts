import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { RouterModule } from "@angular/router";
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ThemeConstantService } from './services/theme-constant.service';
import { SearchPipe } from './pipes/search.pipe';
import { AuthenticationService } from './services/authentication.service';
import { NzNotificationModule } from 'ng-zorro-antd';

@NgModule({
    exports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        NzIconModule,
        PerfectScrollbarModule,
        SearchPipe
    ],
    imports: [
        RouterModule,
        CommonModule,
        NzIconModule,
        NzNotificationModule,
        PerfectScrollbarModule
    ],
    declarations: [
        SearchPipe
    ],
    providers: [
        ThemeConstantService,
        AuthenticationService
    ]
})

export class SharedModule { }
