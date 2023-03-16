import {Component} from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {CurrentUser} from "../model/CurrentUser";

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css']
})
export class CommonComponent {
  constructor(private authService: AuthService, private router:Router) {
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
}
