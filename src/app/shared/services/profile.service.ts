import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd';
import { Profile } from '../interfaces/profile.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    constructor(private http: HttpClient, private notificationService: NzNotificationService) { }


    getProfile(): Observable<Profile> {
        return this.http.get(`${environment.url}/profile`).pipe(map((result: any) => {
            if (result.status === 200 && result.success) {
                return result.data;
            }
            this.notificationService.error('Error', result.message);
            return result;
        }));
    }

    updateProfile(data) {
        return this.http.put(`${environment.url}/profile`, data).pipe(map((result: any) => {
            if (result.status === 200 && result.success) {
                this.notificationService.success('Success', 'Successfully updated your profile details!');
                return result.success;
            }
            this.notificationService.error('Error', result.message);
            return result.success;
        }));
    }

}