import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../model/Post";
import {User} from "../model/User";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http:HttpClient) {
  }

  getAll():Observable<Post[]> {
    return this.http.get<Post[]>("http://localhost:8080/post");

  }

  findById(id: number): Observable<Post> {

    console.log(this.http.get<Post>(`http://localhost:8080/post/${id}`))

    return this.http.get<Post>('http://localhost:8080/post/'+id);
  }
  delete(id : number) {
    this.http.delete('http://localhost:8080/post/'+id)
  }




}
