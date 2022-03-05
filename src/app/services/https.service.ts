import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpsService {

  constructor(public http: HttpClient) { }


  get(endpoint: string, requestData?: any): Observable<any> {
    const token: any = localStorage.getItem('token');
    const requestHeaders = {
      'Content-Type': 'application/json',
      Authorization: 'bearer ' + token
    };
    let httpParams = new HttpParams();

    for (const key in requestData) {
      httpParams = httpParams.append(key, requestData[key]);
    }
    const httpOptions = {
      headers: requestHeaders,
      params: httpParams
    };
    return this.http.get(endpoint, httpOptions);
  }

  post(endpoint:string, data: any): Observable<any> {
    return this.http.post(endpoint, data,{observe: 'response'});
  }

  put(endpoint:string, data: any): Observable<any> {
    return this.http.put(endpoint, data,{observe: 'response'});
  }

  delete(endpoint:string):Observable<any>{
    return this.http.delete(endpoint)
  }
}
