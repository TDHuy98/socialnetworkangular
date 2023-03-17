import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/User";
import {Friend} from "../model/friend";

@Injectable({
  providedIn: 'root'
})
export class FriendListService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Friend[]> {
    return this.http.get<Friend[]>('http://localhost:8080/friends');
  }
  addFriend(friend:Friend): Observable<Friend> {
    return this.http.post<Friend>('http://localhost:8080/friends', friend);
  }
  requestCancer(friend:Friend): Observable<Friend> {
    // @ts-ignore
    return this.http.put<Friend>('http://localhost:8080/friends/cancer', friend);
  }
  unFriend(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/friends/${id}`);
  }
}
