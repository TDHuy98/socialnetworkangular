import {Component, OnInit} from '@angular/core';
import {User} from "./model/User";
import {FriendListService} from "./service/friend-list.service";
import {Friend} from "./model/friend";
import {UserService} from "./service/user.service";
import {MainTimeLineComponent} from "./main-time-line/main-time-line.component";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "./auth.service";
import {CurrentLoggedInUser} from "./model/CurrentLoggedInUser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'socialnetworkangular';
  currentUser: User = new User();
  currenTargettUser: User = new User();

  currentLoginUser = new CurrentLoggedInUser();

  currentUserId: number;

  currentLoggedInUser: CurrentLoggedInUser;

  private mainTimeLineComponent: MainTimeLineComponent;

  getCurrentUser(user: User) {
    this.currentUser = user;
  }


  mainTL: MainTimeLineComponent | undefined

  constructor(private friendService: FriendListService, route: ActivatedRoute,
              private userService: UserService,
              private router: Router,
              private authService: AuthService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;


    this.currentLoggedInUser = {
      id: 1,
      firstname: '',
      middlename: '',
      lastname: '',
      profile: '',
      dateOfBirth: Date,
      email: '',
      username: '',
      mobile: ''
    }
    this.userService.findById(Number(localStorage.getItem('userId'))).subscribe(
      data => {
        console.log(data);
        this.currentUser = data;
        this.loggedInUser = data;

        localStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUser))
      }
    )
  }

  currentClickId: number = 0;

  friendList: Friend[] = []

  activeFriends: Friend[] = []

  activeFriendsId: number[] = []
  loggedInUser: User;


  ngOnInit(): void {
    alert(this.loggedInUser.id)
    // @ts-ignore
    this.currentClickId = Number(localStorage.getItem('userId'))
    console.log(this.currentClickId)
    // if (this.currentClickId=Undefined)

    this.userService.findById(Number(localStorage.getItem('userId'))).subscribe(
      data => {
        console.log(data);
        this.currentUser = data;
        this.loggedInUser = data
        this.currentClickId = data.id
        localStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUser))
      }
    )
    //get current logged in user and save them to localstorage

    this.authService.getCurrentLoggedInUser().subscribe(data => {
      this.currentLoggedInUser = data
      this.currentUserId = this.currentLoginUser.id;
      localStorage.setItem('loggedInUser', JSON.stringify(this.currentLoggedInUser))
      console.log("local", localStorage.getItem('loggedInUser'))
    }, error => {
      console.log('can not get current logged in user')
    })
    console.log(this.currentLoggedInUser)
    this.showUser()
  }


  onOutLetLoader(mainTimeLineComponent: MainTimeLineComponent) {
    this.currentClickId = mainTimeLineComponent.currentClickId
  }

  showUser() {
    this.userService.findById(this.loggedInUser.id).subscribe(
      data => {
        this.loggedInUser = data

      }
    )
  }


  fowardToMainTimeLine(id: number) {
    this.currentClickId = id
    this.router.navigateByUrl("/mainTimeLine/" + id)
    localStorage.setItem('currentUserId', String(id))
    console.log(id);
  }

  goToUserFeed(id: number) {
    this.router.navigateByUrl("/mainTimeLine/" + id)

  }


  logoutservice() {
    localStorage.clear()
    this.authService.logout()
    this.router.navigateByUrl('')
  }

  getCurrentLoggedInUser() {
    if (localStorage.length != 0) {
      this.authService.getCurrentLoggedInUser().subscribe(data => {
        this.currentLoggedInUser = data
        console.log(this.currentLoggedInUser)
      }, error => {
        console.log('can not get current logged in user')
      })
    }
  }

  checkLog() {
    return localStorage.getItem('authenticationToken') != null;
  }
}

