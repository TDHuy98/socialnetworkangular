import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import {RegisterPayload} from "../register-payload";
import {AuthService} from "../../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup
  registerPayload: RegisterPayload
  public myForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = formBuilder.group({
      firstname: new FormControl(),
      lastname: new FormControl(),
      dateOfBirth: new FormControl(),
      mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email: ['', [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
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
    this.myForm = formBuilder.group({
      mob: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
    })
  }
  get m() {
    return this.myForm.controls;
  }
  onSubmit(){
    console.log(this.myForm.value);
  }
  ngOnInit(): void {
    this.registerErrorMessage = ''


  }

  registerErrorMessage: string = ''


  signup() {
    this.registerErrorMessage = ''

    if (this.isPasswordConfirmed) {

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
        this.registerErrorMessage = error.error
      })
    }
  }

  isPasswordConfirmed: boolean

  checkIsPasswordConfirmed(): boolean {
    this.isPasswordConfirmed = this.registerForm.get('password')?.value == this.registerForm.get('confirmPassword')?.value
    console.log(this.isPasswordConfirmed)
    return this.isPasswordConfirmed
  }
}
