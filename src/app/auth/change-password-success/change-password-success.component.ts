import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {timeout} from "rxjs";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-change-password-success',
  templateUrl: './change-password-success.component.html',
  styleUrls: ['./change-password-success.component.css']
})
export class ChangePasswordSuccessComponent implements OnInit {
  constructor(private router: Router,
              private authService: AuthService) {
  }


  ngOnInit(): void {
    this.authService.logout()
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 3000)//3s
  }
}
