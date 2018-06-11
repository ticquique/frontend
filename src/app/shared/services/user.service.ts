import { Observable, BehaviorSubject } from 'rxjs';
import { IFind } from '../../../interfaces/utils/database/find';
import { AuthService } from './auth.service';
import { IUser } from '../../../interfaces/user';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
@Injectable()
export class UserService {

  public user: BehaviorSubject<IUser> = new BehaviorSubject(null);
  private countTry = 0;
  private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private router: Router
  ) {

    this.authService.authToken.subscribe(tokenVal => {
      if (tokenVal) {
        const token = this.authService.decodeToken(tokenVal);
        if (token) {
          const find: IFind = { resource: `_id-${token.sub}` };
          this.getUser(find).subscribe(val => {
            if (val.length) {
              this.user.next(val[0]);
            } else { this.user.next(null); }
          });
        } else { this.user.next(null); }
      } else { this.user.next(null); }
    });
  }

  public updateUser = (data): Observable<IUser> => {
    return this.httpClient.patch<IUser>(`${environment.api.user.updateUser}`, data);
  }

  public updatePassword = (data): Observable<IUser> => {
    return this.httpClient.put<IUser>(`${environment.api.user.updatePassword}`, data, {headers: this.headers});
  }

  public getUser = (find?: IFind): Observable<IUser[]> => {
    let searchString = '';
    const searchArray: string[] = [];
    if (find) {
      if (find.resource) { searchArray.push(`resource=${find.resource}`); }
      if (find.filter) { searchArray.push(`filter=${find.filter}`); }
      if (find.page) { searchArray.push(`page=${find.page}`); }
      if (find.perPage) { searchArray.push(`perPage=${find.perPage}`); }
      if (find.partial) { searchArray.push(`partial=${find.partial}`); }
      if (find.sort) { searchArray.push(`sort=${find.sort}`); }
      if (find.populate) { searchArray.push(`populate=${find.populate}`); }
      searchString = `?${searchArray.join('&')}`;
    }
    return this.httpClient.get<IUser[]>(`${environment.api.user.getUser}${searchString}`);
  }

}
