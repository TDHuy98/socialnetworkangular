import {Component} from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {CurrentLoggedInUser,} from "../model/CurrentLoggedInUser";

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css']
})
export class CommonComponent {
  constructor(private authService: AuthService, private router:Router) {
  }

  currentLoggedInUser: CurrentLoggedInUser


  logoutservice() {
    localStorage.clear()
    this.authService.logout()
    this.router.navigateByUrl('')
  }

  getCurrentLoggedInUser() {
    this.authService.getCurrentLoggedInUser().subscribe(data => {
      this.currentLoggedInUser = data
      console.log(this.currentLoggedInUser)
    }, error => {
      console.log('can not get current logged in user')
    })
  }

  checkLog() {
   return  localStorage.getItem('authenticationToken')!=null;
  }
}
