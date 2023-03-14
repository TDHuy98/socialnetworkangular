import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupName} from "@angular/forms";
import {LoginPayload} from "../login-payload";
import {AuthService} from "../../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup
  loginPayload: LoginPayload

  constructor(private authService: AuthService, private router:Router) {
    this.loginForm = new FormGroup({
      username: new FormControl,
      password: new FormControl
    }),
      this.loginPayload = {
        username: '',
        password: ''
      }
  }
  login(){
    this.loginPayload.username=this.loginForm.get("username")?.value;
    this.loginPayload.password=this.loginForm.get("password")?.value;
    this.authService.login(this.loginPayload).subscribe(data=>{
      console.log('login success')
      this.router.navigateByUrl("/home")
    },error => {
      console.log('login fail')
    })
  }
}
