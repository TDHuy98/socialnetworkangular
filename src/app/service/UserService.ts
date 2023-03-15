import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../model/Post";
import {User} from "../model/User";

export class UserService {
  constructor(private http: HttpClient) {
  }
  findAll(): Observable<User[]> {
    return  this.http.get<User[]>("http://localhost:8080/user")
  }



  // findById(id: number): Observable<User> {
  //
  //   return this.http.get<User>('http://localhost:8080/user/'+id);
  // }


  findByUserName(name: string): Observable<User[]>{
    return this.http.get<User[]>(`http://localhost:8080/user/ ${name}`)
  }



}
