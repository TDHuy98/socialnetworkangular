import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";
import {Comment} from "../model/Comment";
import {CommentDto} from "../model/Dto/CommentDto";


@Injectable({
  providedIn: 'root'
})

export class CmtService {

  constructor(private http: HttpClient) {
  }


  getAllCmt(): Observable<CommentDto[]> {
    return this.http.get<CommentDto[]>('http://localhost:8080/cmt')
  }



  findById(id: number): Observable<CommentDto> {
    return this.http.get<CommentDto>('http://localhost:8080/cmt/' + id);
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/cmt/${id}`);
  }

  create(comment: Comment): Observable<any> {
    return this.http.post('http://localhost:8080/cmt', comment);
  }



  edit(comment: Comment): Observable<any> {
    return this.http.put('http://localhost:8080/Cmt', comment);
  }
  deleteAllByPost(id: number): Observable<void>{
    return this.http.delete<void>(`http://localhost:8080/Cmt/deleteCmtByPost/${id}`)
  }
}

