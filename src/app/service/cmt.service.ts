import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";
import {Comment} from "../model/model/Comment";


@Injectable({
  providedIn: 'root'
})

export class CmtService {

  constructor(private http: HttpClient) {
  }


  getAllCmt(): Observable<Comment[]> {
    return this.http.get<Comment[]>('http://localhost:8080/Cmt')
  }



  findById(id: number): Observable<Comment> {
    return this.http.get<Comment>('http://localhost:8080/Cmt/' + id);
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/Cmt/${id}`);
  }

  create(comment: Comment): Observable<any> {
    return this.http.post('http://localhost:8080/Cmt', comment);
  }



  edit(comment: Comment): Observable<any> {
    return this.http.put('http://localhost:8080/Cmt', comment);
  }
  deleteAllByPost(id: number): Observable<void>{
    return this.http.delete<void>(`http://localhost:8080/Cmt/deleteCmtByPost/${id}`)
  }
}

