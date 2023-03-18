import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../../model/Post";
import {Router} from "@angular/router";
import {NewPost} from "../../model/Dto/newPost";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient, private router:Router) { }

  findAllByUser_Id(id:number):Observable<Post[]> {
    return this.http.get<Post[]>('http://localhost:8080/posts/'+id)
  }

  save(post : NewPost) : Observable<any> {
    return this.http.post('http://localhost:8080/posts/create',post)
  }

  delete(id : number) : Observable<any> {
    return this.http.put('http://localhost:8080/posts/delete/'+id,id)
  }


  findById(id : number): Observable<any> {
    return this.http.get<Post>('http://localhost:8080/posts/findById/'+ id)
  }

  edit(post : any) : Observable<any> {
    return this.http.post('http://localhost:8080/posts/edit',post);
  }
}
