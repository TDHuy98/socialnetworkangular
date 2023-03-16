import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../../model/User";
import {Injectable} from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {
  }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>("http://localhost:8080/user")
  }


  findByUserName(username: string): Observable<User[]>{
    return this.http.get<User[]>(`http://localhost:8080/user/`+username )
  }

}
