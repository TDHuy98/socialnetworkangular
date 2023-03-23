import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subscription} from "rxjs";
import {User} from "../model/User";
import {data} from "jquery";
import {UserDto} from "../model/UserDto";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private url = 'http://localhost:8080/api/v1/common/'

  constructor(private httpClient: HttpClient) {
  }

  onGetData: EventEmitter<any> = new EventEmitter();

  search(searchValue: string): Observable<UserDto[]> {
    return this.httpClient.post<UserDto[]>(this.url + searchValue, searchValue);
  }



}
