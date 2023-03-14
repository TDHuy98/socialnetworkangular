import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../model/model/Post";
import {ImgPost} from "../model/model/ImgPost";

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



  edit(post: Post): Observable<any> {
    return this.http.put('http://localhost:8080/posts', post);
  }
}

