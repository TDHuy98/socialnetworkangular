import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegisterPayload} from "./auth/register-payload";
import {Observable} from "rxjs";
import {LoginPayload} from "./auth/login-payload";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "http://localhost:8080/api/v1/auth/"

  constructor(private httpClient: HttpClient) {
  }

  register(registerPayload: RegisterPayload):Observable<any> {
    return this.httpClient.post(this.url + "register", registerPayload)
  }

  login(loginPayload: LoginPayload):Observable<any>{
    return this.httpClient.post(this.url+"login",loginPayload)
  }

  logout(token:String){return this.httpClient.post(this.url+"logout",token)}
}
