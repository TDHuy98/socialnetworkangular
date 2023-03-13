import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {RegisterPayload} from "./register-payload";
import {AuthServiceService} from "../auth-service.service";

@Component({
  selector: 'app-show-register',
  templateUrl: './show-register.component.html',
  styleUrls: ['./show-register.component.css']
})
export class ShowRegisterComponent implements OnInit{
  registerForm: FormGroup
  registerPayload: RegisterPayload

  constructor(private formBuilder: FormBuilder, private authService: AuthServiceService) {
    this.formBuilder.group({
      firstname: '',
      lastname: '',
      dateOfBirth: Date,
      email: '',
      mobile: '',
      username: '',
      password: ''

    });
    this.registerPayload = {
      firstname: '',
      lastname: '',
      dateOfBirth: new Date,
      email: '',
      mobile: '',
      username: '',
      password: '',
    }
  }

  register() {
    this.registerPayload.firstname = this.registerForm.get('firstname')?.value;
    this.registerPayload.lastname = this.registerForm.get('lastname')?.value;
    this.registerPayload.dateOfBirth = this.registerForm.get('dateOfBirth')?.value;
    this.registerPayload.email = this.registerForm.get('email')?.value;
    this.registerPayload.mobile = this.registerForm.get('mobile')?.value;
    this.registerPayload.username = this.registerForm.get('username')?.value;
    this.registerPayload.password = this.registerForm.get('password')?.value;

    this.authService.register(this.registerPayload).subscribe(data=>{
      console.log('register success');
    },error => {
      console.log('register failed')
    })

  }

  ngOnInit(): void {
  }
}
