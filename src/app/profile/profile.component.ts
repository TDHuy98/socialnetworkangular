import {Component, OnInit} from '@angular/core';
import {User} from "../model/User";
import {UserService} from "../service/UserService";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  constructor(private userService: UserService) {
  }
users: User[] | undefined;

  ngOnInit(): void {

    this.userService.findAll().subscribe((data) => {
      console.log(data)
      this.users = data
    })
  }



}
