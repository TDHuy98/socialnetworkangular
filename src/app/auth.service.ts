import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegisterPayload} from "./auth/register-payload";
import {map, Observable} from "rxjs";
import {LoginPayload} from "./auth/login-payload";
import jwt_decode from "jwt-decode";
import {JwtAuthResponse} from "./auth/jwt-auth-response";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "http://localhost:8080/api/v1/auth/"
  jwtAuthResponse: JwtAuthResponse
  constructor(private httpClient: HttpClient,) {
  }



  register(registerPayload: RegisterPayload): Observable<any> {
    return this.httpClient.post(this.url + "register", registerPayload)
  }


   jwtBody = {
    sub: '',
    iat: '',
    exp: ''
  }
  jwt={
    token:''
  }

  login(loginPayload: LoginPayload): Observable<any> {
    return this.httpClient.post<any>(this.url + "login", loginPayload, {responseType: "text" as "json"})
      .pipe(map(data => {
        console.log(data);
        this.jwtAuthResponse = data;
        console.log("abc" + (this.jwtAuthResponse.authenticationToken))
        this.jwtBody = jwt_decode(data);
        console.log("test " + this.jwtBody)
        localStorage.setItem('authenticationToken', data);
        localStorage.setItem('username', this.jwtBody.sub);
        console.log(localStorage.getItem('username'))
        return data;
      }));
  }

  logout() {
    const token = this.jwtAuthResponse
    console.log("logout success")
    return this.httpClient.post("http://localhost:8080/api/v1/auth/logout", token)
  }
}
