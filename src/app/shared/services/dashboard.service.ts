import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd';
import { Statistics } from '../interfaces/stat.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient, private notificationService: NzNotificationService) { }

  getStats(): Observable<Statistics> {
    return this.http.get(`${environment.url}/stats`).pipe(map((result: any) => {
      if (result.status === 200 && result.success) {
        return result.data;
      }
      this.notificationService.error('Error', result.message);
      return null;
    }));
  }
}
