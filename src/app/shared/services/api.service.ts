import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {Endpoints} from '../endpoints';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient,
              private endpoints: Endpoints) {
  }

  public post(body, url) {
    return this.http.post(url, body).pipe(
      catchError(this.handleError),
    );
  }

  public put(body, url, param) {
    return this.http.put(url + '/' + param, body).pipe(
      catchError(this.handleError),
    );
  }

  public get(param, url) {
    return this.http.get(url + '/' + param).pipe(
      catchError(this.handleError),
    );
  }


  public getQuery(url) {
    return this.http.get(url).pipe(
      catchError(this.handleError),
    );
  }

  public delete(param, url) {
    return this.http.delete(url + '/' + param).pipe(
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse): any {
    return throwError(error);
  }
}
