import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../model/model/Post";
import {ImgPost} from "../model/model/ImgPost";

@Injectable({
  providedIn: 'root'
})

export class ImgService {

  constructor(private http: HttpClient) {
  }


  getAllImg(): Observable<ImgPost[]> {
    return this.http.get<ImgPost[]>('http://localhost:8080/images')
  }



  findById(id: number): Observable<ImgPost> {
    return this.http.get<ImgPost>('http://localhost:8080/images/' + id);
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/images/${id}`);
  }

  create(imgPost: { post: { id: number }; name: string }): Observable<ImgPost> {
    return this.http.post<ImgPost>('http://localhost:8080/images', imgPost);
  }

  createTest(imgPost: ImgPost): Observable<any> {
    return this.http.post('http://localhost:8080/posts', imgPost);
  }

  edit(imgPost: ImgPost): Observable<any> {
    return this.http.put('http://localhost:8080/posts', imgPost);
  }
  deleteAllByPost(postId: number): Observable<void>{
    return this.http.delete<void>(`http://localhost:8080/images/deleteImgByPost/${postId}`)
  }
}

