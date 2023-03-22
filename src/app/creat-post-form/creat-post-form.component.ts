import {Component, OnInit} from '@angular/core';
import {Stomp} from "@stomp/stompjs";
import {User} from "../model/User";
import {PostService} from "../service/post.service";
import {UserService} from "../service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Message} from "../model/Message";


@Component({
  selector: 'app-creat-post-form',
  templateUrl: './creat-post-form.component.html',
  styleUrls: ['./creat-post-form.component.css']
})
export class CreatPostFormComponent implements OnInit {
  title = 'grokonez';
  description = 'Angular-WebSocket Demo';
  message: string = "";

  messageText: string[] = [];
  disabled = true;
  name: string | undefined;
  stompClient: any;
  loggedInUser: User = new User();

  currenLogInId = Number(localStorage.getItem("userId"));
  currentId: number;
  currentClickId: number;
  messsageBox: Message[]

  constructor(private postService: PostService, private userService: UserService,
              private route: ActivatedRoute, private router: Router,) {
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.messageText = [];
      this.messsageBox = []

    }
  }

  connect(id1: number) {
    // @ts-ignore
    this.currentClickId = +this.route.snapshot.paramMap.get('id');

    id1 = this.loggedInUser.id;
    // đường dẫn đến server
    const socket = new WebSocket('ws://localhost:8080/gkz-stomp-endpoint/websocket');
    this.stompClient = Stomp.over(socket);
    const _this = this;
    this.stompClient.connect({}, function (frame: any) {
      _this.setConnected(true);
      // là chờ xèm thằng server gửi về.
      _this.stompClient.subscribe(`/topic/public/${id1}`, function (hello: any) {

        console.log("joanToan", hello)
        _this.showGreeting(JSON.parse(hello.body));
      });

    });
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    this.setConnected(false);
    console.log('Disconnected!');
  }

  sendName(idFriend: number) {
    this.stompClient.send(
      `/gkz/hello`,
      {},
      // Dữ liệu được gửi đi
      JSON.stringify({
        'name': this.loggedInUser.lastname,
        'message': this.message,
        'idSender': this.loggedInUser.id,
        'idRev': idFriend
      })
    );
  }

  showGreeting(message: any) {
    this.messageText.push(message);
    this.messsageBox.push(message)
  }

  ngOnInit(): void {
    // @ts-ignore
    this.currentClickId = +this.route.snapshot.paramMap.get('id');
    this.currentId = Number(localStorage.getItem('currentUserId'))
    // @ts-ignore
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    this.connect(this.loggedInUser.id)
  }

  fowardToMainTimeLine(id: number) {
    this.currentClickId = id;
    this.router.navigateByUrl("/mainTimeLine/" + id)
  }

  getAvatar() {
    return localStorage.getItem('avatarChat')
  }
}
