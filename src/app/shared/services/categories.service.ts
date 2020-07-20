import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Category } from '../interfaces/categories.model';
import { map } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories: Category[] = [];
  childCategories: Category[] = [];
  parentCategories: Category[] = [];

  constructor(private http: HttpClient, private notificationService: NzNotificationService) {

  }
  ////Data sharing Service
  private Data = new BehaviorSubject(null);
  sharedData = this.Data.asObservable();
  nextMessage(message: string) {
    this.Data.next(message)
  }
  //The service to list Categories
  listCategories() {
    let url = environment.url + '/categories';
    let headers = new HttpHeaders()
      .set('Accept', 'application/json');
    return this.http.get<any>(url, { headers })
  }

  //Get parent id
  ParentID(id: string): Observable<any> {
    let headers = new HttpHeaders()
      .set('Accept', 'application/json');
    let endpoint = environment.url + `/categories?parentId=${id}`
    return this.http.get<any>(endpoint, { headers })

  }
  //image upload service
  uploadUrl(fileToUpload: File): Observable<Object> {
    let headers = new HttpHeaders()
    const endpoint = environment.url + '/signed_post_url';
    let payload = {
      fileName: fileToUpload.name,
      contentType: fileToUpload.type,
    }
    return this.http.post(endpoint, payload, { headers })
  }

  //Create Category Service
  CreateCategory(payload: any): Observable<Object> {
    let headers = new HttpHeaders()
    const endpoint = environment.url + '/categories';
    return this.http.post(endpoint, payload, { headers })
  }

  //Upload to s3 bucket
  UploadToS3(fileToUpload: any, UploadUrl: any): any {
    const headers = new HttpHeaders()
    const endpoint = UploadUrl;
    return this.http.post(endpoint, fileToUpload, { headers })

  }

  //Update Category
  UpdateCategory(payload: any): Observable<Object> {
    let headers = new HttpHeaders()
    const endpoint = environment.url + `/categories/${1}`;
    return this.http.post(endpoint, payload, { headers })
  }

  //Delete Category
  DeleteCategory(payload: any): any {
    let id = payload._id;
    console.log('payload: ', payload)
    console.log("Service id ", id)
    const endpoint = environment.url + `/categories/${id}`;
    // console.log(endpoint)
    return this.http.delete(endpoint, payload)
  }


  getSubCategories(id?: string): Observable<Category[]> {
    let params = new HttpParams().append("parentId", `${id}`);
    return this.http.get(`${environment.url}/categories`, { params }).pipe(map((result: any) => {
      if (result.status === 200 && result.success) {
        return result.data;
      }
      this.notificationService.error('Error', result.message);
      return [];

    }));
  }

  getAllCategories(): Observable<boolean> {
    let params = new HttpParams()
      .append("all", `${true}`)
    return this.http.get(`${environment.url}/categories`, { params }).pipe(map((result: any) => {
      if (result.status === 200 && result.success) {
        this.categories = result.data;
        this.childCategories = this.categories.filter((category) => { if (category.parentId) return category });
        return true;
      }
      this.notificationService.error('Error', result.message);
      return false;

    }));
  }


}
