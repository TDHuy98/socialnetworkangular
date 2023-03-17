import { Component, OnInit } from '@angular/core';
import {UserService} from "../service/user.service";
import {User} from "../model/User";

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})
export class FriendListComponent implements OnInit {

  constructor(private userService: UserService,) {
  }
  listFriend: User[] = []
  user!: User;

  ngOnInit(): void {
    this.userService.findById(1).subscribe(data => {
        console.log(data);
        this.user = data;

      }
    )
  }


}
