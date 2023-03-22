import {Component, OnInit} from '@angular/core';
import {Stomp} from "@stomp/stompjs";
import {User} from "../model/User";
import {Message} from "../model/Message";
import {FormControl, FormGroup} from "@angular/forms";
import {MessageService} from "../service/messageService";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{
  currentLoggedInUserId = Number(localStorage.getItem('userId'))
  targetId : any
  friend : User | any;
  message: string = "";

  messages: Message[] = [];
  disable = true;
  messageForm : FormControl | any;

  private stompClient: any;

  constructor(private messageService: MessageService,private userService:UserService) {
    this.targetId = 2;

    this.userService.findById(this.targetId).subscribe( data =>
      this.friend = data
    )

    this.messageService.getAllMessageByUserSourAndTarget(this.currentLoggedInUserId,this.targetId).subscribe(data => {
      this.messages= data
    })
  }

  ngOnInit() {

    this.messageForm = new FormGroup({
      id : new FormControl(""),
      sourceId : new FormControl(this.currentLoggedInUserId),
      targetId: new FormControl("targetId"),
      message : new FormControl("message")
    })

  }

  setConnected(connected: boolean) {
    this.disable = !connected;
    if(this.currentLoggedInUserId!= null) {
      this.messages =[];
    }
    if (connected) {
      this.messages = [];
    }
  }

  connect() {
    //đường dẫn đến server
    const socket = new WebSocket('ws://localhost:8080/gkz-stomp-endpoint/websocket');
    this.stompClient = Stomp.over(socket)

    const _this = this;

    this.stompClient.connect({},
      function (frame: any) {
        _this.setConnected(true);
        _this.stompClient.subscribe('/topic/public/' + _this.currentLoggedInUserId ,
          function (message: any) {
            _this.showMessages(JSON.parse(message))
          }
        )
      }
    )
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
  }

  sendMessage() {
    this.stompClient.send(
      '/gkz/content',
      {},
      JSON.stringify({
        'id':0,
        'sourceId': this.currentLoggedInUserId,
        'targetId': this.targetId,
        'message': this.messageForm.get("message").value
      })
    );
  }



  showMessages(message: Message) {
    this.messages.push(message)
  }
}
