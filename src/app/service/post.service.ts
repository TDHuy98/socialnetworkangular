import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../model/model/Post";
import {ImgPost} from "../model/model/ImgPost";
import {Like} from "../model/Like";
import {Comment} from "../model/model/Comment";

@Injectable({
  providedIn: 'root'
})

export class PostService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>('http://localhost:8080/posts');
  }

  getAllImg(): Observable<ImgPost[]> {
    return this.http.get<ImgPost[]>('http://localhost:8080/images')
  }

  findAll(): Observable<Post[]> {
    return this.http.get<Post[]>('http://localhost:8080/posts');
  }

  findById(id: number): Observable<Post> {
    return this.http.get<Post>('http://localhost:8080/posts/' + id);
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/posts/${id}`);
  }

  create(post: { postTime: string; user: { id: number }; content: any }): Observable<Post> {
    return this.http.post<Post>('http://localhost:8080/posts', post);
  }

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
  getAllComment(): Observable<Comment[]> {
    return this.http.get<Comment[]>('http://localhost:8080/cmt');
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

