import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/User";

import {UserUpdate} from "../model/UserUpdate";
import {ChangePassword} from "../model/ChangePassword";
import {UserSearch} from "../model/UserSearch";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = "http://localhost:8080//api/v1/user-setting/"

  constructor(private httpClient: HttpClient) {
  }

  getUserInformation(): Observable<UserUpdate> {
    return this.httpClient.get<UserUpdate>(this.url + localStorage.getItem('userId'))
  }

  updateUserInformation(userInformation: UserUpdate): Observable<UserUpdate> {
    return this.httpClient.put<UserUpdate>(this.url + "setting", userInformation)
  }
  enableSearchable():Observable<any>{
    return this.httpClient.post("http://localhost:8080/common/"+"enable-search"+"/"+ localStorage.getItem('userId'),null )
  }

  disableSearchable(): Observable<any> {
    return this.httpClient.post("http://localhost:8080/common/" + "disable-search"+"/"+ localStorage.getItem('userId'),null )
  }


  changePassword(changePassword: ChangePassword): Observable<ChangePassword> {
    return this.httpClient.put<ChangePassword>(this.url + "changepassword", changePassword)
  }


  mystatusChanged: EventEmitter<any> = new EventEmitter();
  activeFriendsIds: any;

  get data(): any {
    return this.activeFriendsIds;
  }

  set data(val: any) {
    this.activeFriendsIds = val;
    this.mystatusChanged.emit(val);
  }


  findById(id: number): Observable<User> {
    return this.httpClient.get<User>('http://localhost:8080/user/' + id);
  }


}

