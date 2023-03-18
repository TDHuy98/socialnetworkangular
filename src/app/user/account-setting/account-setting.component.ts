import {Component, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {FormControl, FormGroup} from "@angular/forms";
import {UserUpdate} from "../../model/UserUpdate";
import {ChangePassword} from "../../model/ChangePassword";
import {Observable} from "rxjs";
import {AuthService} from "../../auth.service";
import {Router} from "@angular/router";

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


  constructor(private userService: UserService, private authService: AuthService,
              private router: Router) {
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

    window.location.reload();
  }

  checkUserPassword: ChangePassword = new ChangePassword()
  password: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  isNewPasswordConfirmed: boolean
  isPasswordChecked: boolean=true

  checkIsNewPasswordConfirmed(): boolean {
    console.log(this.newPassword == this.confirmNewPassword)
    this.isNewPasswordConfirmed = this.newPassword == this.confirmNewPassword
    return this.isNewPasswordConfirmed
  }

  checkPassword(): boolean {
    this.checkUserPassword.userId = Number(localStorage.getItem('userId'))
    this.checkUserPassword.password = this.password
    console.log(this.checkUserPassword)
    this.userService.isPasswordCorrect(this.checkUserPassword).subscribe(result => {
      this.isPasswordChecked = result
      console.log(result)
      // return result;
    }, error => {
      console.log('không check được password')
    })
    console.log(this.isPasswordChecked)
    return this.isPasswordChecked
  }

  userChangePassword = new ChangePassword();
  message: string = ''

  changePassword() {
    this.checkPassword()
    if (this.isNewPasswordConfirmed && this.isPasswordChecked) {
      this.userChangePassword.userId = Number(localStorage.getItem('userId')),
        this.userChangePassword.password = this.newPassword
      this.userService.changePassword(this.userChangePassword).subscribe(data => {
        console.log('đổi mk thành công')
        this.router.navigateByUrl('/change-password-success')
      }, error => {
        console.log('đổi mk thất bại')
      })


    } else this.message = 'kiểm tra lại thông tin đã nhập'

  }

}

