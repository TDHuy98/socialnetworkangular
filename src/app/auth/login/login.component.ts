import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupName} from "@angular/forms";
import {LoginPayload} from "../login-payload";
import {AuthService} from "../../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginPayload: LoginPayload


  constructor(private authService: AuthService, private router: Router) {
    this.loginPayload = {
      username: '',
      password: ''
    }
    this.loginForm = new FormGroup({
      username: new FormControl,
      password: new FormControl,
    })
  }

  LoginFailedMessage: string
  //
  // isLogginFormPass(): boolean {
  //   this.loginPayload.username = this.loginForm.get('username')?.value;
  //   this.loginPayload.password = this.loginForm.get('password')?.value;
  //   this.authService.checkLogginForm(this.loginPayload).subscribe(data => {
  //     console.log("login Infor " + data)
  //     this.isLogginInforPass = data
  //   }, error => {
  //     console.log(error)
  //   })
  //   return this.isLogginInforPass
  // }

  login() {
    this.loginPayload.username = this.loginForm.get('username')?.value;
    this.loginPayload.password = this.loginForm.get('password')?.value;
    this.authService.login(this.loginPayload).subscribe(data => {
      this.LoginFailedMessage =''
      console.log('login success')
      this.router.navigateByUrl("/home")
    }, error => {
      console.log(error.error)
      this.LoginFailedMessage = error.error

    })
    // }
  }

  ngOnInit(): void {
    this.LoginFailedMessage = ''
  }


}
