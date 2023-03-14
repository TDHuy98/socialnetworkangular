import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/User";


@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:8080/users');
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
    return this.http.get<User>('http://localhost:8080/users/' + id);
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

