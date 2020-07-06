import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, mergeMap } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd';

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    constructor(private http: HttpClient, private notificationService: NzNotificationService) { }

    getUploadUrl(fileName: string, contentType) {
        return this.http.post(`${environment.url}/signed_post_url`, { fileName, contentType }).pipe(map((result: any) => {
            if (result.status === 200 && result.success) {
                return result.data;
            }
            this.notificationService.error('Error', result.message);
            return null;
        }));
    }

    uploadFile(file, data) {
        let form = new FormData();
        form.append("key", data.key)
        form.append("Content-Type", file.type)
        form.append("acl", 'public-read')
        form.append("bucket", data.signedUrlPostData.fields.bucket)
        form.append("X-Amz-Algorithm", data.signedUrlPostData.fields['X-Amz-Algorithm'])
        form.append("X-Amz-Credential", data.signedUrlPostData.fields['X-Amz-Credential'])
        form.append("X-Amz-Date", data.signedUrlPostData.fields['X-Amz-Date'])
        form.append("Policy", data.signedUrlPostData.fields['Policy'])
        form.append("X-Amz-Signature", data.signedUrlPostData.fields['X-Amz-Signature'])
        form.append('file', file, file.name);
        return this.http.post(data.signedUrlPostData.url, form);
    }

    both(file) {

        return this.http.post(`${environment.url}/signed_post_url`, { fileName: file.name, contentType: file.type })
            .pipe(map((result: any) => {
                const data = result.data;
                let form = new FormData();
                form.append("key", data.key)
                form.append("Content-Type", file.type)
                form.append("acl", 'public-read')
                form.append("bucket", data.signedUrlPostData.fields.bucket)
                form.append("X-Amz-Algorithm", data.signedUrlPostData.fields['X-Amz-Algorithm'])
                form.append("X-Amz-Credential", data.signedUrlPostData.fields['X-Amz-Credential'])
                form.append("X-Amz-Date", data.signedUrlPostData.fields['X-Amz-Date'])
                form.append("Policy", data.signedUrlPostData.fields['Policy'])
                form.append("X-Amz-Signature", data.signedUrlPostData.fields['X-Amz-Signature'])
                form.append('file', file, file.name);
                return { url: data.signedUrlPostData.url, formData: form };
            }), mergeMap(data => {
                return this.http.post(data.url, data.formData);
            }));



    }

}