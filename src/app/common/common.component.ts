import {Component} from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css']
})
export class CommonComponent {
  constructor(private authService: AuthService, private router:Router) {
  }



  logoutservice() {
    localStorage.clear()
    this.authService.logout()
      this.router.navigateByUrl('')

  }
}
