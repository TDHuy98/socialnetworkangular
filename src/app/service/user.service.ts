import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserUpdate} from "../model/UserUpdate";
import {Observable} from "rxjs";
import {CheckPassword} from "../model/CheckPassword";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = "http://localhost:8080/user/"

  constructor(private httpClient: HttpClient) {
  }

  getUserInformation(): Observable<UserUpdate> {
    return this.httpClient.get<UserUpdate>(this.url + localStorage.getItem('userId'))
  }

  updateUserInformation(userInformation: UserUpdate): Observable<UserUpdate> {
    return this.httpClient.post<UserUpdate>(this.url + "setting", userInformation)
  }


  isPasswordCorrect(checkPassword: CheckPassword){
    return this.httpClient.post<boolean>(this.url+"changepassword", checkPassword)
  }
}

