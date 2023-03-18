import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/User";

import {UserUpdate} from "../model/UserUpdate";
import {ChangePassword} from "../model/ChangePassword";

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

  // getAllImg(): Observable<ImgPost[]> {
  //   return this.http.get<ImgPost[]>('http://localhost:8080/images')
  // }
  //
  // findAll(): Observable<Post[]> {
  //   return this.http.get<Post[]>('http://localhost:8080/posts');
  // }
  //
  findById(id: number): Observable<User> {
    return this.httpClient.get<User>('http://localhost:8080/user/' + id);
  }

  //
  //
  // delete(id: number): Observable<void> {
  //   return this.http.delete<void>(`http://localhost:8080/posts/${id}`);
  // }
  //
  // create(post: { postTime: string; user: { id: number }; content: any }): Observable<Post> {
  //   return this.http.post<Post>('http://localhost:8080/posts', post);
  // }


  // edit(post: Post): Observable<any> {
  //   return this.http.put('http://localhost:8080/posts', post);
  // }
}

