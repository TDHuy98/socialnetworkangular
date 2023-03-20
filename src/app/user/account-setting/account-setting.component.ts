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
  userUpdate = new UserUpdate()
  userInfor = {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    mobile: '',
    intro: '',
  }

  updateInforMessage: string


  constructor(private userService: UserService, private authService: AuthService,
              private router: Router) {
    this.updateInformationForm = new FormGroup({
      firstName: new FormControl,
      middleName: new FormControl,
      lastName: new FormControl,
      email: new FormControl,
      mobile: new FormControl,
      intro: new FormControl,
    })

    this.changePasswordForm = new FormGroup({
      password: new FormControl,
      newPassword: new FormControl,
      confirmNewPassword: new FormControl
    })
  }

  ngOnInit(): void {
    this.userService.getUserInformation().subscribe(data => {
        this.userUpdate = data
        this.userInfor.firstName = data.firstName,
          this.userInfor.middleName = data.middleName,
          this.userInfor.lastName = data.lastName,
          this.userInfor.email = data.email,
          this.userInfor.mobile = data.mobile
        this.userInfor.intro = data.intro

        // @ts-ignore
        // this.updateInformationForm.setValue({
        //   firstName: data.firstName,
        //   middleName: data.middleName,
        //   lastName:data.lastName,
        //   email:data.email,
        //   mobile:data.mobile,
        //   intro:data.intro
        // })

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
    this.userUpdate.firstName = this.userInfor.firstName
    this.userUpdate.middleName = this.userInfor.middleName
    this.userUpdate.lastName = this.userInfor.lastName
    this.userUpdate.email = this.userInfor.email
    this.userUpdate.mobile = this.userInfor.mobile
    this.userUpdate.intro = this.userInfor.intro
    console.log(this.userUpdate)

    this.userService.updateUserInformation(this.userUpdate).subscribe(data => {
      console.log('update thành công')
    }, error => {
      this.updateInforMessage = error.error
    })

    // window.location.reload();
  }

  checkUserPassword: ChangePassword = new ChangePassword()
  isNewPasswordConfirmed: boolean
  isPasswordChecked: boolean = true

  checkIsNewPasswordConfirmed(): boolean {
    console.log(this.changePasswordForm.get('newPassword')?.value == this.changePasswordForm.get('confirmNewPassword')?.value)
    this.isNewPasswordConfirmed = this.changePasswordForm.get('newPassword')?.value == this.changePasswordForm.get('confirmNewPassword')?.value
    return this.isNewPasswordConfirmed
  }

  userChangePassword = new ChangePassword();
  message: string = ''
  changePasswordForm: FormGroup;

  changePassword() {
    this.userChangePassword.userId = Number(localStorage.getItem('userId')),
      this.userChangePassword.oldPassword = this.changePasswordForm.get('password')?.value
    this.userChangePassword.newPassword = this.changePasswordForm.get('newPassword')?.value
    this.userService.changePassword(this.userChangePassword).subscribe(data => {
      console.log('đổi mk thành công')
      this.router.navigateByUrl('/change-password-success')
    }, error => {
      this.message = error.error
      console.log('đổi mk thất bại')
    })

  }

}

