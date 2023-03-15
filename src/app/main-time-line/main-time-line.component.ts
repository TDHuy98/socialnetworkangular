import {Component, Input, EventEmitter, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core';
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
export class MainTimeLineComponent implements OnInit, OnChanges {
  currentId: number = 1;
  currenLogInId: number = 1;
  id: number | undefined;
  currentUser = new User;
  currentUserId: number = 0;
  friendList: Friend[] = []

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router, private friendService: FriendListService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.friendService.getAll().subscribe(
      data => {

        this.friendList = data;

        this.currentActiveFriendsId = this.showFriendListIdByIdUserAndStatus(this.currenLogInId, 'Active', 'Normal', this.friendList)
        this.currentNewFriendsId = this.showFriendListIdByIdUserAndStatus(this.currenLogInId, 'New', 'Normal', this.friendList)
        this.currentBlockFriendsId = this.showFriendListIdByIdUserAndStatus(this.currenLogInId, 'Block', 'Normal', this.friendList)
        this.currentSenderFriendsId = this.showFriendListIdByIdUserAndStatus(this.currenLogInId, 'Sender', 'Normal', this.friendList)

      })
    this.showDit()
  }

  showDit() {
    // @ts-ignore
    this.currentId = +this.route.snapshot.paramMap.get('id');
    // @ts-ignore
    this.currentUserId = +this.route.snapshot.paramMap.get('id');
    if (this.currentId == 0) {
      this.currentId = 1
    }
    if (this.currentUserId == 0) {
      this.currentId = 1
    }
    this.userService.findById(this.currentId).subscribe(data => {
      this.currentUser = data
    });


    console.log('actve fr', this.currentActiveFriendsId)
    console.log(this.currentNewFriendsId)
    console.log(this.currentBlockFriendsId)
  }

  @Input() activeFriendsId: number[] = []
  // @Input() NewFriends:Friend[] =[]
  // @Input() BlockFriends:Friend[] =[]

  currentListFriends: Friend[] = []
  currentListFriendsId: number[]
  currentListType: number[]
  activeFriends: Friend[] = []
  NewFriends: Friend[] = []
  BlockFriends: Friend[] = []
  newFriendsId: number[] = []
  blockFriendsId: number[] = []
  currentNewFriendsId: number[] = []
  currentBlockFriendsId: number[] = []
  currentActiveFriendsId: number[] = []
  currentSenderFriendsId: number[] = []

  showFriends(choose: number) {
    if (choose == 1) {
      this.currentListFriends = this.activeFriends
    }
    if (choose == 2) {
      this.currentListFriends = this.NewFriends
    }
    if (choose == 3) {
      this.currentListFriends = this.BlockFriends
    }
  }

  showFriendListByIdUserAndStatus(id: number, status: string, type: string) {
    this.currentListFriends = []
    for (let i = 0; i < this.friendList.length; i++) {
      if (this.friendList[i].friendshipStatus == status && this.friendList[i].relationshipType == type && this.friendList[i].source.id == id) {
        this.currentListFriends.push(this.friendList[i])
      }
    }
    console.log(this.currentListFriends)
    console.log(this.friendList)
    console.log(this.currentUserId)
  }

  showFriendListIdByIdUserAndStatus(id: number, status: string, type: string, listFriend: Friend[]) {
    this.currentListType = []

    for (let i = 0; i < this.friendList.length; i++) {
      if (listFriend[i].friendshipStatus == status && listFriend[i].relationshipType == type && listFriend[i].source.id == id) {
        this.currentListType.push(listFriend[i].target.id)
        console.log('showFriendListIdByIdUserAndStatus')
      }
    }
    return this.currentListType
  }

  fowardToMainTimeLine(id: number) {
    this.router.navigateByUrl("/mainTimeLine/" + id)
    console.log(id);
  }

  // addFriend
  AddFiend(sourceId: number, targetId: number, relationshipType: string, friendshipStatus: string) {
    const friend = {
      "source": {
        "id": sourceId
      },
      "target": {
        "id": targetId
      },
      relationshipType: relationshipType,
      friendshipStatus: 'Sender',
    };
    const friendTarget = {
      "source": {
        "id": targetId
      },
      "target": {
        "id": sourceId
      },
      relationshipType: relationshipType,
      friendshipStatus: 'New',
    };
    // console.log(this.friend)
    // @ts-ignore
    this.friendService.addFriend(friend).subscribe((data) => {
        // @ts-ignore
        this.friendService.addFriend(friendTarget).subscribe((data) => {
          window.location.reload()

          }
        );
      }
    );
  }
  acceptFiend(sourceId: number, targetId: number, relationshipType: string, friendshipStatus: string) {
    let sourceCancer = -1;
    let targetCancer = -1;
    this.friendList.forEach(f=> {
      if (f.target.id == targetId && f.source.id== sourceId){sourceCancer= f.id}
      if (f.target.id == sourceId && f.source.id == targetId) {targetCancer= f.id}
    })
    const friend = {
      // id:sourceId,
      "source": {
        "id": sourceId
      },
      "target": {
        "id": targetId
      },
      relationshipType: 'Normal',
      friendshipStatus: 'Active',
    };
    const friendTarget = {
      // id: targetId,
      "source": {
        "id": targetId
      },
      "target": {
        "id": sourceId
      },
      relationshipType: 'Normal',
      friendshipStatus: 'Active',
    };
    this.friendRequestCancerNoReload(sourceId,targetId)
    // this.friendRequestCancer(targetId,sourceId)
    // console.log(this.friend)
    console.log(sourceCancer+"_"+targetCancer)
    // @ts-ignore
    this.friendService.addFriend(friend).subscribe((data) => {
        // @ts-ignore
        this.friendService.addFriend(friendTarget).subscribe((data) => {
          window.location.reload()
          }
        );
      }
    );
  }

  cancerFriendRequest(sourceId: number, targetId: number) {
    const friend = {
      "source": {
        "id": sourceId
      },
      "target": {
        "id": targetId
      },
      relationshipType: 'Normal',
      friendshipStatus: 'None',
    };
    // @ts-ignore
    this.friendService.requestCancer(friend).subscribe((data) => {

      }
    );
  }
  friendRequestCancerNoReload(sourceId: number, targetId: number) {
    let sourceCancer = -1;
    let targetCancer = -1;
    this.friendList.forEach(f=> {
      if (f.target.id == targetId && f.source.id== sourceId){
        sourceCancer= f.id
      }
      if (f.target.id == sourceId && f.source.id == targetId) {
        targetCancer= f.id
      }
    })
    console.log(sourceCancer+"_"+targetCancer)
    // @ts-ignore
    this.friendService.unFriend(sourceCancer).subscribe((data) => {
      this.friendService.unFriend(targetCancer).subscribe((data) => {
        }
      );
      }
    );

  }
  friendRequestCancer(sourceId: number, targetId: number) {
    let sourceCancer = -1;
    let targetCancer = -1;
    this.friendList.forEach(f=> {
      if (f.target.id == targetId && f.source.id== sourceId){
        sourceCancer= f.id
      }
      if (f.target.id == sourceId && f.source.id == targetId) {
        targetCancer= f.id
      }
    })
    console.log(sourceCancer+"_"+targetCancer)
    // @ts-ignore
    this.friendService.unFriend(sourceCancer).subscribe((data) => {
        this.friendService.unFriend(targetCancer).subscribe((data) => {
            window.location.reload()

          }
        );
      }
    );

  }
}
