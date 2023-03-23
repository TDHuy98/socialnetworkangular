import {Component, OnInit} from '@angular/core';
import {User} from "./model/User";
import {FriendListService} from "./service/friend-list.service";
import {Friend} from "./model/friend";
import {UserService} from "./service/user.service";
import {MainTimeLineComponent} from "./main-time-line/main-time-line.component";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "./auth.service";
import {CurrentLoggedInUser} from "./model/CurrentLoggedInUser";
import {Notifications} from "./model/Dto/Notifications";
import {PostService} from "./service/post.service";
import {map, Subscription, timer} from "rxjs";
import {FriendDto} from "./model/Dto/FriendDto";
import {Stomp} from "@stomp/stompjs";
import {Message} from "./model/Message";
import {SearchService} from "./service/search.service";
import {UserDto} from "./model/UserDto";

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

  mainTimeLineComponent: MainTimeLineComponent;
  curentLoginActiveFriends: FriendDto[];
  currentNewFriendsId: any[];
  currentActiveFriendsId: any[];
  currentSenderFriendsId: any[];
  currenLogInId: number;
  curentLoginSenderFriends: FriendDto[];
  curentLoginNewFriends: FriendDto[];
  curentLoginBlockFriends: FriendDto[];
  currentBlockFriendsId: any;

  getCurrentUser(user: User) {
    this.currentUser = user;
  }


  mainTL: MainTimeLineComponent | undefined

  constructor(private friendService: FriendListService, route: ActivatedRoute,
              private userService: UserService,
              private router: Router,
              private postService: PostService,
              private activatedRoute: ActivatedRoute,
              private searchService: SearchService,
              private authService: AuthService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;


    this.currentLoggedInUser = {
      id: 1,
      firstName: '',
      middleName: '',
      lastName: '',
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
  NewFriends: Friend[] = []

  BlockFriends: Friend[] = []
  newFriendsId: number[] = []
  blockFriendsId: number[] = []
  activeFriendsId: number[] = []
  loggedInUser: User;
  searchValue: '';


  countnotice: number = 0;

  countNotice() {
    setTimeout(()=>(this.countNotice()), 5000)
    this.countnotice = 0;
    this.postService.getAllNotices(this.loggedInUser.id).subscribe(
      data => {
        data.forEach(item => {
          if (item.status == 'Uncheck')
            this.countnotice += 1;
        })
      }
    )
    return this.countnotice
  }

  ngOnInit(): void {
this.countNotice()
    this.loadNotice(this.loggedInUser.id)

    //get current clicked user id
    // @ts-ignore
    this.currentClickId = Number(localStorage.getItem('userId'))
    this.currenLogInId = Number(localStorage.getItem('userId'))
    // if (this.currentClickId=Undefined)
    //check if there is a user logged in

    this.userService.findById(Number(localStorage.getItem('userId'))).subscribe(
      data => {
        console.log(this.curentLoginActiveFriends)
        this.postService.getAllNotices(this.loggedInUser.id).subscribe(
          data => {
            this.notices = data;
          }
        )
        console.log(data);
        this.currentUser = data;
        this.loggedInUser = data
        this.currentClickId = data.id
        localStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUser))
      }
    )
    //get current logged in user and save them to localstorage
    if (localStorage.length != 0) {
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
  }

  loadloginListFr() {
    this.friendService.getActiveFriendListByIdUser(this.currenLogInId).subscribe(
      data => {
        this.curentLoginActiveFriends = data
        this.currentActiveFriendsId = []
        this.currentNewFriendsId = []
        this.currentSenderFriendsId = []

        this.friendService.getSendFriendListByIdUser(this.currenLogInId).subscribe(
          data => {
            this.curentLoginSenderFriends = data

            this.friendService.getNewFriendListByIdUser(this.currenLogInId).subscribe(
              data => {
                this.curentLoginNewFriends = data

                this.friendService.getBlockFriendListByIdUser(this.currenLogInId).subscribe(
                  data => {
                    this.curentLoginBlockFriends = data
                    this.curentLoginActiveFriends.forEach(item => {
                      this.currentActiveFriendsId.push(item.target.id)
                    })
                    this.curentLoginSenderFriends.forEach(item => {
                      this.currentSenderFriendsId.push(item.target.id)
                    })
                    this.curentLoginNewFriends.forEach(item => {
                      this.currentNewFriendsId.push(item.target.id)
                    })
                    this.curentLoginBlockFriends.forEach(item => {
                      this.currentBlockFriendsId.push(item.target.id)
                    })


                  }
                )

              }
            )
          }
        )
      }
    )
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

  goToFeed() {
    if (localStorage.getItem('authenticationToken') != null) {
      this.router.navigateByUrl("/feed")
    } else {
      this.router.navigateByUrl("/login")
    }
  }

  notices: Notifications[];

  loadNotice(idUser: number) {
    this.postService.getAllNotices(idUser).subscribe(
      data => {
        this.notices = data;
        console.log("notice", this.notices)
      }
    )
  }

  goToChat(id: number, avatar: string, nameClick: string) {
    this.currentClickId = id;
    localStorage.setItem('avatarChat', String(avatar));
    localStorage.setItem('nameChat', String(nameClick));
    this.router.navigateByUrl("/reg/" + id)
  }

  timerSubscription: Subscription;
  // countNotice() {
  //   this.countnotice=0;
  //
  //   // this.timerSubscription = timer(0,3000).pipe(
  //   //   map(()=>{
  //
  //
  //       this.postService.getAllNotices(this.loggedInUser.id).subscribe(
  //         data => {
  //           data.forEach(item => {
  //             if (item.status =='Uncheck')
  //               this.countnotice+=1;
  //           })
  //         }
  //       )
  //       return this.countnotice
  //   //   })
  //   // ).subscribe()
  //
  //
  // }

  loadMess(id: number) {
    this.friendService.getActiveFriendListByIdUser(id).subscribe(
      data => {
        this.curentLoginActiveFriends = data
        this.currentActiveFriendsId = []
        this.currentNewFriendsId = []
        this.currentSenderFriendsId = []

        this.friendService.getSendFriendListByIdUser(id).subscribe(
          data => {
            this.curentLoginSenderFriends = data

            this.friendService.getNewFriendListByIdUser(id).subscribe(
              data => {
                this.curentLoginNewFriends = data

                this.friendService.getBlockFriendListByIdUser(id).subscribe(
                  data => {
                    this.curentLoginBlockFriends = data
                    this.curentLoginActiveFriends.forEach(item => {
                      this.currentActiveFriendsId.push(item.target.id)
                    })
                    this.curentLoginSenderFriends.forEach(item => {
                      this.currentSenderFriendsId.push(item.target.id)
                    })
                    this.curentLoginNewFriends.forEach(item => {
                      this.currentNewFriendsId.push(item.target.id)
                    })
                    this.curentLoginBlockFriends.forEach(item => {
                      this.currentBlockFriendsId.push(item.target.id)
                    })


                  }
                )

              }
            )
          }
        )
      }
    )
  }

  stompClient: any;
  disabled = true;
  messsageBox: Message[]

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.messsageBox = []

    }
  }

  showGreeting(message: any) {
    this.messsageBox.push(message)
  }

  connect(id1: number) {
    // @ts-ignore
    // this.currentClickId = +this.route.snapshot.paramMap.get('id');

    id1 = this.loggedInUser.id;
    // đường dẫn đến server
    const socket = new WebSocket('ws://localhost:8080/gkz-stomp-endpoint/websocket');
    this.stompClient = Stomp.over(socket);
    const _this = this;
    this.stompClient.connect({}, function (frame: any) {
      _this.setConnected(true);
      // là chờ xèm thằng server gửi về.
      _this.stompClient.subscribe(`/topic/public/${id1}`, function (hello: any) {

        console.log("joanToan", hello)
        _this.showGreeting(JSON.parse(hello.body));
      });

    });
  }


  users: UserDto[]

  searchBar() {
    if (this.searchValue != "") {
      this.searchService.search(this.searchValue).subscribe(data => {
        this.users = data
      }, error => {
        console.log('lỗi rồi Huy ơi')

      })
    }
  }

  search() {
    this.searchService.search(this.searchValue).subscribe(data => {
      console.log(JSON.stringify(data))
      this.users = data
      this.router.navigate(['/search-result'], {state: {result: data}, onSameUrlNavigation: "reload"},)
    }, error => {
      console.log('lỗi rồi Huy ơi')

    })
  }


}

