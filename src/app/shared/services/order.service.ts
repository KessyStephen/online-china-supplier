import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';
import { Order } from '../interfaces/order.interface';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private notificationService: NzNotificationService) { }

  getOrders(page: number, perPage: number, sort?: string): Observable<{ results: Order[], total: number }> {
    let params = new HttpParams()
      .append('page', `${page}`)
      .append('perPage', `${perPage}`)
      .append('sort', `${sort}`)

    return this.http.get(`${environment.url}/orders`, { params }).pipe(map((result: any) => {
      if (result.status === 200 && result.success) {
        return { total: result.total, results: result.data };
      }
      this.notificationService.error('Error', result.message);
      return { total: 0, results: [] };

    }));
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get(`${environment.url}/orders/${id}`).pipe(map((result: any) => {
      if (result.status === 200 && result.success) {
        return result.data;
      }
      this.notificationService.error('Error', result.message);
      return null;
    }));
  }

  updateOrder(orderId: string, data: any) {
    return this.http.put(`${environment.url}/orders/${orderId}`, data).pipe(map((result: any) => {
      if (result.status === 200 && result.success) {
        return result.success;
      }
      this.notificationService.error('Error', result.message);
      return null;
    }));
  }

  getOrderStatusList() {
    return this.http.get(`${environment.url}/order_status`).pipe(map((result: any) => {
      if (result.status === 200 && result.success) {
        return result.data;
      }
      this.notificationService.error('Error', result.message);
      return null;
    }));
  }
}
