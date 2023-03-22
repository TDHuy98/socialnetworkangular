import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Message} from "../model/Message";

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  constructor(private http: HttpClient) {
  }

  getAllMessageByUserSourAndTarget(sourceId : number,targetId : number) : Observable<any> {
    return this.http.get<Message[]>('http://localhost:8080/message/'+ sourceId +"&"+targetId);
  }

  getAllFriend(sourceId : number) {
    return this.http.get('http://localhost:8080/message/' + sourceId);
  }
}
