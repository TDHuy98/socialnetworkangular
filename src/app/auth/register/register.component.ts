import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {RegisterPayload} from "../register-payload";
import {AuthService} from "../../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm:FormGroup
  registerPayload: RegisterPayload

  constructor(private authService: AuthService, private router:Router) {
    this.registerForm= new FormGroup({
      firstname: new FormControl(),
      lastname: new FormControl(),
      dateOfBirth: new FormControl(),
      mobile: new FormControl(),
      email: new FormControl(),
      username: new FormControl(),
      password: new FormControl(),
      confirmPassword: new FormControl()
    }),
      this.registerPayload = {
        firstname: '',
        lastname: '',
        dateOfBirth: new Date(),
        email: '',
        mobile: '',
        username: '',
        password: ''
      }
  }

  ngOnInit(): void {
  }


  signup() {
    this.registerPayload.firstname = this.registerForm.get("firstname")?.value;
    this.registerPayload.lastname = this.registerForm.get("lastname")?.value;
    this.registerPayload.dateOfBirth = this.registerForm.get("dateOfBirth")?.value;
    this.registerPayload.email = this.registerForm.get("email")?.value;
    this.registerPayload.mobile = this.registerForm.get("mobile")?.value;
    this.registerPayload.username = this.registerForm.get("username")?.value;
    this.registerPayload.password = this.registerForm.get("password")?.value;
    this.authService.register(this.registerPayload).subscribe(data => {
      console.log('registed success'),
        this.router.navigateByUrl('/register-success')
    }, error => {
      console.log('registed fail')
    })
  }

}
