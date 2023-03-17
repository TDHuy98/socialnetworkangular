import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegisterPayload} from "./auth/register-payload";
import {map, Observable} from "rxjs";
import {LoginPayload} from "./auth/login-payload";
import jwt_decode from "jwt-decode";
import {JwtAuthResponse} from "./auth/jwt-auth-response";
import {CurrentLoggedInUser,} from "./model/CurrentLoggedInUser";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "http://localhost:8080/api/v1/auth/"
  constructor(private httpClient: HttpClient,) {
  }



  register(registerPayload: RegisterPayload): Observable<any> {
    return this.httpClient.post(this.url + "register", registerPayload)
  }


   jwtBody = {
     sub: '',
     iat: '',
     exp: '',
     jti: ''
   }
  jwt = {
    token: ''
  }
  jwtAuthResponse: JwtAuthResponse
  someOneLoggedIn: boolean;

  login(loginPayload: LoginPayload): Observable<any> {
    return this.httpClient.post<any>(this.url + "login", loginPayload, {responseType: "text" as "json"})
      .pipe(map(data => {
        console.log(JSON.parse(data));
        this.jwtAuthResponse = JSON.parse(data);
        console.log(this.jwtAuthResponse.token)
        this.jwtBody = jwt_decode(data);
        localStorage.setItem('authenticationToken', this.jwtAuthResponse.token);
        localStorage.setItem('username', this.jwtBody.sub);
        localStorage.setItem('userId', this.jwtBody.jti)
        console.log(this.jwtBody.jti)
        console.log(localStorage.getItem('username'))
        this.someOneLoggedIn = true
        return data;
      }));
  }

  logout() {
    return this.httpClient.post(this.url + "logout", null)
  }

  getAuthToken() {
    return localStorage.getItem('authenticationToken')
  }

  getCurrentUserId() {
    const id = Number(localStorage.getItem('userId'))
  }

  getCurrentLoggedInUser() {
    return this.httpClient.get<CurrentLoggedInUser>(this.url + 'getUser/' + localStorage.getItem('userId'))
  }
}
