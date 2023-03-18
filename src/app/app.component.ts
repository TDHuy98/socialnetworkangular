import {Component, OnInit} from '@angular/core';
import {User} from "./model/User";
import {FriendListService} from "./service/friend-list.service";
import {Friend} from "./model/friend";
import {UserService} from "./service/user.service";
import {MainTimeLineComponent} from "./main-time-line/main-time-line.component";
import {Router} from "@angular/router";
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
  // @ts-ignore
  currentLoginUser = new CurrentLoggedInUser();

  currentUserId: number;
  currentNewFriendsId: number[] = []
  currentBlockFriendsId: number[] = []
  currentActiveFriendsId: number[] = []
  currentLoggedInUser: CurrentLoggedInUser;

  private mainTimeLineComponent: MainTimeLineComponent;

  getCurrentUser(user: User) {
    this.currentUser = user;
  }


  mainTL: MainTimeLineComponent | undefined

  constructor(private friendService: FriendListService,
              private userService: UserService,
              private router: Router,
              private authService: AuthService) {
    userService.mystatusChanged.subscribe(status => this.friendList);

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
  }

  friendList: Friend[] = []

  activeFriends: Friend[] = []
  NewFriends: Friend[] = []

  BlockFriends: Friend[] = []
  newFriendsId: number[] = []
  blockFriendsId: number[] = []
  activeFriendsId: number[] = []


  ngOnInit(): void {
    if (localStorage.length != 0) {
      this.friendService.getAll().subscribe(
        data => {
          this.friendList = data;

          for (let i = 0; i < this.friendList.length; i++) {
            if (this.friendList[i].source.id == this.currentUserId && this.friendList[i].friendshipStatus == ("Active")) {
              this.activeFriendsId.push(this.friendList[i].id);
              this.activeFriends.push(this.friendList[i])
            }
          }
          for (let i = 0; i < this.friendList.length; i++) {
            if (this.friendList[i].source.id == this.currentUserId && this.friendList[i].friendshipStatus == ("New")) {
              this.newFriendsId.push(this.friendList[i].id);
              this.NewFriends.push(this.friendList[i])

            }
          }
          for (let i = 0; i < this.friendList.length; i++) {
            if (this.friendList[i].source.id == this.currentUserId && this.friendList[i].friendshipStatus == ("Block")) {
              this.blockFriendsId.push(this.friendList[i].id);
              this.BlockFriends.push(this.friendList[i])
            }
          }
          console.log(this.friendList)
        }
      )

      this.userService.findById(Number(localStorage.getItem('userId'))).subscribe(
        data => {
          console.log(data);
          this.currentUser = data;

        }
      )
      //get current logged in user and save them to localstorage

      this.authService.getCurrentLoggedInUser().subscribe(data => {
        this.currentLoggedInUser = data
        this.currentUserId = this.currentLoginUser.id;
        console.log(JSON.stringify(this.currentLoggedInUser))
        console.log(this.currentLoggedInUser.id)
        console.log(this.currentLoggedInUser.profile)
        localStorage.setItem('loggedInUser', JSON.stringify(this.currentLoggedInUser))
        console.log(localStorage.getItem('loggedInUser'))
      }, error => {
        console.log('can not get current logged in user')
      })
      console.log(this.currentLoggedInUser)
    }
  }


  onOutLetLoader(mainTimeLineComponent: MainTimeLineComponent) {
    mainTimeLineComponent.activeFriends = this.activeFriends;
    mainTimeLineComponent.NewFriends = this.NewFriends;
    mainTimeLineComponent.newFriendsId = this.newFriendsId;
    mainTimeLineComponent.BlockFriends = this.BlockFriends;
    mainTimeLineComponent.blockFriendsId = this.blockFriendsId;
    mainTimeLineComponent.currentUserId = this.currentUserId;
    mainTimeLineComponent.friendList = this.friendList;
  }


  fowardToMainTimeLine(id: number) {
    this.currentUserId = id
    this.router.navigateByUrl("/mainTimeLine/" + id)
    localStorage.setItem('currentUserId', String(id))
    console.log(id);
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

