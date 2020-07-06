import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Product } from '../interfaces/product.interface';
import { environment } from 'src/environments/environment';
import { NzNotificationService } from 'ng-zorro-antd';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient, private notificationService: NzNotificationService) { }

  productList: Product[] = []

  listProducts(page: number, perPage: number, sort?: string): Observable<{ results: Product[], total: number }>{
    let params = new HttpParams()
      .append('page', `${page}`)
      .append('perPage', `${perPage}`)
      .append('sort', `${sort}`)

    return this.http.get(`${environment.url}/products`, { params }).pipe(map((result: any) => {
      if (result.status === 200 && result.success) {
        return { total: result.total, results: result.data };
      }
      this.notificationService.error('Error', result.message);
      return { total: 0, results: [] };
    }));
  }

  createProduct(product: Product) {
    return this.http.post(`${environment.url}/products`, product).pipe(map((result: any) => {
      if (result.status === 200 && result.success) {
        return result.success;
      }
      this.notificationService.error('Error', result.message);
      return null;
    }));
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get(`${environment.url}/products/${id}`).pipe(map((result: any) => {
      if (result.status === 200 && result.success) {
        return result.data;
      }
      this.notificationService.error('Error', result.message);
      return null;
    }));
  }

}
