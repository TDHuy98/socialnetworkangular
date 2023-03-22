import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/User";

import {UserUpdate} from "../model/UserUpdate";
import {ChangePassword} from "../model/ChangePassword";
import {UserSearch} from "../model/UserSearch";
import {Message} from "../model/Message";
import {Notifications} from "../model/Dto/Notifications";

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
    return this.httpClient.put<UserUpdate>(this.url + "setting", userInformation)
  }


  isPasswordCorrect(checkPassword: ChangePassword): Observable<boolean> {
    return this.httpClient.post<boolean>(this.url + "checkpassword", checkPassword)
  }

  changePassword(changePassword: ChangePassword): Observable<ChangePassword> {
    return this.httpClient.put<ChangePassword>(this.url + "changepassword", changePassword)
  }

  getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>('http://localhost:8080/users');
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

  search(searchValue:string):Observable<UserSearch[]>{
    return this.httpClient.get<UserSearch[]>(this.url+searchValue)
  }
  findAllMessById(id: number): Observable<Message> {
    return this.httpClient.get<Message>('http://localhost:8080/Message/' + id);
  }
  createMessage(message: Message): Observable<Message>{
    return this.httpClient.post<Message>(`http://localhost:8080/Notice`,message)
  }
  deleteMessage(id: number): Observable<void> {
    return this.httpClient.delete<void>(`http://localhost:8080/Notice/${id}`);
  }
}

