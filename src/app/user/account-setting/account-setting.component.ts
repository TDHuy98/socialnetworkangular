import {Component, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {FormControl, FormGroup} from "@angular/forms";
import {UserUpdate} from "../../model/UserUpdate";
import {CheckPassword} from "../../model/CheckPassword";

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {
  settingNavigation: string = 'profile';
  updateInformationForm: FormGroup;
  userUpdate: UserUpdate = new UserUpdate()
  firstName: string = '';
  middleName: string = '';
  lastName: string = '';
  email: string = '';
  intro: string = '';


  constructor(private userService: UserService) {
    this.updateInformationForm = new FormGroup({
      firstName: new FormControl,
      lastName: new FormControl,
      email: new FormControl,
      intro: new FormControl,
    })
  }

  ngOnInit(): void {
    this.userService.getUserInformation().subscribe(data => {
        this.userUpdate = data
        this.firstName = data.firstName,
          this.middleName = data.middleName,
          this.lastName = data.lastName,
          this.email = data.email,
          this.intro = data.intro
        console.log(data)
        console.log('lấy thông tin user cần update thông tin thành công')
      }, error => {
        console.log('lấy thông tin user cần update thông tin thất bại')
      },
    )


  }

  selected(value: string) {
    this.settingNavigation = value
  }

  updateInformation() {
    this.userUpdate.firstName = this.firstName
    this.userUpdate.middleName = this.middleName
    this.userUpdate.lastName = this.lastName
    this.userUpdate.email = this.email
    this.userUpdate.intro = this.intro
    console.log(this.userUpdate)

    this.userService.updateUserInformation(this.userUpdate).subscribe(data => {
      console.log('update thành công')
    }, error => {
      console.log('update thất bại')
    })


  }

  checkUserPassword: CheckPassword = new CheckPassword()
  password: string = '';

  checkPassword() {
    this.checkUserPassword.userId = Number(localStorage.getItem('userId'))
    this.checkUserPassword.password = this.password
    this.userService.isPasswordCorrect(this.checkUserPassword)
    console.log(this.checkUserPassword)
  }
}
