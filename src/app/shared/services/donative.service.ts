import { Injectable } from "@angular/core";
import { IUser } from "../../../interfaces";
import { HttpClient } from "@angular/common/http";
import { UserService } from "./user.service";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable()
export class DonativeService {

  private user: IUser;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.initialize();
  }

  private initialize() {
    this.userService.user.subscribe(user => {
      this.user = user;
    });
  }

  public createCustomer(code: string, scope: string): Observable<IUser> {
    return this.http.post<IUser>(environment.api.donative.createCustomer, {
      code, scope
    });
  }

  public createCharge(account: string, amount: number, donate?: boolean, token?: string, email?: string): Observable<any> {
    const body: any = {};
    body.account = account;
    body.amount = amount;
    if (donate) { body.donate = donate; }
    if (token) { body.token = token; }
    if (email) { body.email = email; }
    return this.http.post<IUser>(environment.api.donative.createCharge, body);
  }

  // public oauthRedirect(): Promise<any> {
  //   return new Promise<any> ((resolve, reject) => {
  //     if (this.user) {
  //       this.http.post(environment.api.donative.createCustomer, {
  //         username: this.user.username,
  //         id: this.user.id
  //       }).subscribe(val => { resolve(val); });
  //     } else {
  //       reject('no user provided');
  //     }
  //   });
  // }

}
