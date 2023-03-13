import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegisterPayload} from "./show-register/register-payload";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private url = "http://localhost:8080/api/v1/auth/"

  constructor(private httpClient: HttpClient) {
  }

  register(registerPayload: RegisterPayload): Observable<any> {
    return this.httpClient.post(this.url + "register", registerPayload)
  }
}
