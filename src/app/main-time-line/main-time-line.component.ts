import {Component, Input, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Friend} from "../model/friend";
import {User} from "../model/User";
import {UserService} from "../service/user.service";
import {FriendListService} from "../service/friend-list.service";

@Component({
  selector: 'app-main-time-line',
  templateUrl: './main-time-line.component.html',
  styleUrls: ['./main-time-line.component.css']
})
export class MainTimeLineComponent implements OnInit {
  currentId:number = 1;
  id: number | undefined;
  currentUser= new User;
  currentUserId: number =0;
  friendList:Friend[]=[]

  constructor(private route: ActivatedRoute, private userService: UserService,private router: Router,private friendService: FriendListService) {
  }

  ngOnInit(): void {
    this.showDit()
  }
  showDit(){
    // @ts-ignore
    this.currentId = +this.route.snapshot.paramMap.get('id');
    if (this.currentId==0){this.currentId=1}
    this.userService.findById(this.currentId).subscribe(data => {
      this.currentUser = data
    });


  }

  @Input() activeFriendsId:number[]=[]
  // @Input() NewFriends:Friend[] =[]
  // @Input() BlockFriends:Friend[] =[]

  currentListFriends:Friend[]=[]
  activeFriends:Friend[] =[]
  NewFriends:Friend[] =[]
  BlockFriends:Friend[] =[]
  newFriendsId:number[]=[]
  blockFriendsId:number[]=[]
  showFriends(choose: number) {
    if (choose==1) {
      this.currentListFriends= this.activeFriends
    }
    if (choose==2){
      this.currentListFriends= this.NewFriends
    }
    if (choose==3){
      this.currentListFriends= this.BlockFriends
    }
  }
  showFriendListByIdUserAndStatus(id:number,status:string,type:string) {
    for (let i = 0; i < this.activeFriends.length; i++) {
      if (this.activeFriends[i].friendshipStatus == status && this.activeFriends[i].relationshipType == type && this.activeFriends)
    }
  }
  fowardToMainTimeLine(id:number){
    this.router.navigateByUrl("/mainTimeLine/"+id )
    console.log(id);
  }
}
