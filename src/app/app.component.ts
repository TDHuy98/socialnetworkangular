import { Component } from '@angular/core';
import {User} from "./model/User";
import {FriendListService} from "./service/friend-list.service";
import {Friend} from "./model/friend";
import {UserService} from "./service/user.service";
import {MainTimeLineComponent} from "./main-time-line/main-time-line.component";
import {Router} from "@angular/router";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'socialnetworkangular';
  currentUser : User = new User();
  currentUserId : number=1;
  currenTargettUser : User = new User();
  currentLoginUser : User = new User();
  getCurrentUser(user: User){
    this.currentUser = user;
  }
  listFriend: User[] = []
  mainTL: MainTimeLineComponent | undefined
  constructor(private friendService:FriendListService,private  userService:UserService,private router:Router, ) {
    // userService.mystatusChanged.subscribe(status=>this.activeFriendsId);

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }
  friendList:Friend[]=[]

  activeFriendsId:number[]=[]
  activeFriends:Friend[] =[]
  NewFriends:Friend[] =[]

  BlockFriends:Friend[] =[]
  newFriendsId:number[]=[]
  blockFriendsId:number[]=[]

  ngOnInit(): void {
    this.friendService.getAll().subscribe(
      data=>{
        console.log(data);
        console.log(this.currentUserId)
        this.friendList= data;
        for (let i=0;i<this.friendList.length;i++){
          if (this.friendList[i].source.id==this.currentUserId&&this.friendList[i].friendshipStatus==("Active")){
            this.activeFriendsId.push(this.friendList[i].id);
            this.activeFriends.push(this.friendList[i])
          }
        }
        for (let i=0;i<this.friendList.length;i++){
          if (this.friendList[i].source.id==this.currentUserId&&this.friendList[i].friendshipStatus==("New")){
            this.newFriendsId.push(this.friendList[i].id);
            this.NewFriends.push(this.friendList[i])

          }
        }
        for (let i=0;i<this.friendList.length;i++){
          if (this.friendList[i].source.id==this.currentUserId&&this.friendList[i].friendshipStatus==("Block")){
            this.blockFriendsId.push(this.friendList[i].id);
            this.BlockFriends.push(this.friendList[i])
          }
        }
        console.log(this.activeFriendsId)
      }
    )
    this.userService.findById(1).subscribe(
      data=>{
        console.log(data);
        this.currentUser = data;
        this.currentLoginUser= data;

      }
    )
  }
  onOutLetLoader(mainTimeLineComponent:MainTimeLineComponent) {
    mainTimeLineComponent.activeFriendsId = this.activeFriendsId;
    mainTimeLineComponent.activeFriends = this.activeFriends;
    mainTimeLineComponent.NewFriends = this.NewFriends;
    mainTimeLineComponent.newFriendsId = this.newFriendsId;
    mainTimeLineComponent.BlockFriends = this.BlockFriends;
    mainTimeLineComponent.blockFriendsId = this.blockFriendsId;
    mainTimeLineComponent.currentUserId= this.currentUserId;
    mainTimeLineComponent.friendList= this.friendList;
  }


  fowardToMainTimeLine(id:number){
    this.currentUserId = id
    this.router.navigateByUrl("/mainTimeLine/"+id )
    console.log(id);
  }

}

