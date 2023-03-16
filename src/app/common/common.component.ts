
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {CurrentUser} from "../model/CurrentUser";
import {FormControl, FormGroup} from "@angular/forms";
import {UserService} from "../service/user/userService";
import {User} from "../model/User";

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css']
})
export class CommonComponent implements OnInit{
  formSearch!: FormGroup;
  users: User[] = []
  constructor(private authService: AuthService, private router:Router,private userService: UserService) {

  }
currentUser:CurrentUser



  logoutservice() {
    localStorage.clear()
    this.authService.logout()
      this.router.navigateByUrl('')
  }

  getCurrentUser() {
    this.authService.getCurrentLoggedInUser().subscribe(data=>{
      this.currentUser=data
      console.log(this.currentUser)
    },error => {
      console.log('can not get current logged in user')})
  }

  ngOnInit() {
    this.formSearch=new FormGroup({
      firstName: new FormControl( )
    })

  }

  searchByName(){
    this.userService.findByUserName(this.formSearch.get("firstName")?.value).subscribe((data)=>{
      console.log(data)
      this.users = data


    },error =>{
      console.log('loi')
    })
  }

  search() {

  }
}
