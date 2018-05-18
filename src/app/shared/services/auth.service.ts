import { IValid } from './../../../interfaces/valid';
import { IEncriptedToken } from './../../../interfaces/utils/token';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IToken } from '../../../interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { Buffer } from 'buffer';
import { first } from 'rxjs/operators';

@Injectable()
export class AuthService {

  public authToken: BehaviorSubject<IEncriptedToken> = new BehaviorSubject(null);
  private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loadToken();
    this.route.queryParams.subscribe(val => {
      if (val.token) {
        this.validateUser(val.token).pipe(first()).subscribe(token => {
          this.storeUserData(token, true);
          this.router.navigate(['welcome']);
        });
      }
    });
  }

  public validateUser = (token: IEncriptedToken) => {
    return this.httpClient.post<IEncriptedToken>(environment.api.user.validateUser, { token }, { headers: this.headers });
  }

  public loggIn = (username: string, password: string): Observable<IEncriptedToken> => {
    return this.httpClient.post<IEncriptedToken>(environment.api.user.authenticate, { username, password }, { headers: this.headers });
  }

  // await to boolean
  public loggedIn = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      const encryptedToken = this.loadToken();
      if (encryptedToken) {
        const token = this.decodeToken(encryptedToken);
        if (token && Math.floor(Date.now() / 1000) < token.exp) {
          this.httpClient.get(environment.api.user.tokenValidation, { headers: this.headers })
            .toPromise().then(val => resolve(true)).catch(val => resolve(false));
        } else { resolve(false); }
      } else { resolve(false); }
    });
  }

  public register = (username: string, role: string, email: string): Observable<IValid> => {
    return this.httpClient.post<IValid>(environment.api.user.registerUser, { username, role, email }, { headers: this.headers });
  }

  // remove credentials
  public logout = (): void => {
    localStorage.clear();
    sessionStorage.clear();
    this.authToken.next(null);
    this.router.navigate(['/home']);
  }

  // return token or null
  public decodeToken = (token: IEncriptedToken): IToken => {
    function base64urlDecode(str) {
      return JSON.parse(Buffer.from(base64urlUnescape(str), 'base64').toString());
    }
    function base64urlUnescape(str) {
      str += new Array(5 - str.length % 4).join('=');
      return str.replace(/\-/g, '+').replace(/_/g, '/');
    }
    const arrayToken = token.split('.');
    if (arrayToken.length !== 3) {
      return null;
    } else {
      const payload = arrayToken[1];
      const decoded: any = base64urlDecode(payload);
      return decoded;
    }
  }

  public storeUserData = (token: IEncriptedToken, remember: boolean) => {
    if (remember) {
      localStorage.setItem('id_token', token);
    } else { sessionStorage.setItem('id_token', token); }
    this.authToken.next(token);
  }

  private loadToken = (tok?: string): IEncriptedToken => {
    const token = tok || localStorage.getItem('id_token') || sessionStorage.getItem('id_token') || null;
    if (token) { this.authToken.next(token); }
    return token;
  }

}
