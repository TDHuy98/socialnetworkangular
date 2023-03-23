import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../../model/Post";
import {Router} from "@angular/router";
import {NewPost} from "../../model/Dto/newPost";
import {PostDto} from "../../model/Dto/PostDto";
import {Like} from "../../model/Like";
import {CommentDto} from "../../model/Dto/CommentDto";
import {Comment} from "../../model/Comment";

@Injectable({
  providedIn: 'root'
})
export class PostServicek {

  constructor(private http:HttpClient, private router:Router) { }

  findAllByUser_Id(id:number):Observable<PostDto[]> {
    return this.http.get<PostDto[]>('http://localhost:8080/posts/'+id)
  }
  feed(id:number):Observable<PostDto[]>{
    return this.http.get<PostDto[]>('http://localhost:8080/posts/feed/'+id)
  }

  save(post : NewPost) : Observable<any> {
    return this.http.post('http://localhost:8080/posts',post)
  }

  delete(id : number) : Observable<any> {
    return this.http.put('http://localhost:8080/posts/'+id,id)
  }

  findById(id : number): Observable<any> {
    return this.http.get<Post>('http://localhost:8080/post/findById/'+ id)
  }

  // HQCLike
  like(like: Like): Observable<Like>{
    return this.http.post<Like>(`http://localhost:8080/like`,like)
  }
  unLike(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/like/${id}`);
  }
  findAllLikeByIdPost(id:number): Observable<Like[]> {
    return this.http.get<Like[]>(`http://localhost:8080/like/posts/${id}`);
  }
  findAllLike(): Observable<Like[]> {
    return this.http.get<Like[]>('http://localhost:8080/like');
  }
  edit(post: Post): Observable<any> {
    return this.http.put('http://localhost:8080/posts', post);
  }
  getAllComment(): Observable<CommentDto[]> {
    return this.http.get<CommentDto[]>('http://localhost:8080/cmt');
  }
  comment(cmt: Comment): Observable<Comment>{
    return this.http.post<Comment>(`http://localhost:8080/cmt`,cmt)
  }
  commentDelete(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/cmt/${id}`);
  }
  coutLike(id:number): Observable<any>{
    return this.http.get<any>(`http://localhost:8080/like/coutLike/${id}`)
  }
}
