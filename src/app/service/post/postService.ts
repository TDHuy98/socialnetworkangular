import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../../model/Post";
import {NewPost} from "../../model/Dto/newPost";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient, private router:Router) { }

  findAllByUser_Id(id:number):Observable<Post[]> {
    return this.http.get<Post[]>('http://localhost:8080/posts/'+id)
  }



  save(newPost : NewPost) : Observable<any> {
    return this.http.post<NewPost>('http://localhost:8080/posts',newPost, )
  }

  delete(id : number) {
    this.http.delete('http://localhost:8080/posts/'+id)
  }

  findById(id : number): Observable<any> {
    return this.http.get<Post>('http://localhost:8080/post/findById/'+ id)
  }
}
