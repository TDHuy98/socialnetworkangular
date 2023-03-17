import {Component, Input, EventEmitter, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Friend} from "../model/friend";
import {User} from "../model/User";
import {UserService} from "../service/user.service";
import {FriendListService} from "../service/friend-list.service";
import {PostService} from "../service/post.service";
import {Post} from "../model/model/Post";
import {Like} from '../model/Like';
import {FormControl, FormGroup} from "@angular/forms";
import {Comment} from "../model/model/Comment";

@Component({
  selector: 'app-main-time-line',
  templateUrl: './main-time-line.component.html',
  styleUrls: ['./main-time-line.component.css']
})
export class MainTimeLineComponent implements OnInit, OnChanges {
  formCmt: FormGroup = new FormGroup({
    content: new FormControl(""),
    name: new FormControl(""),
  })
  currentId: number = 1;
  currentUserLogin: User;

  currenLogInId: number = 1;
  id: number | undefined;
  currentUser = new User;
  currentUserId: number = 0;
  friendList: Friend[] = []
  posts: Post[] = [];
  @Input() activeFriendsId: number[] = []

  currentListFriends: Friend[] = [];
  currentListFriendsId: number[];
  currentListType: number[];
  activeFriends: Friend[] = [];
  NewFriends: Friend[] = [];
  BlockFriends: Friend[] = [];
  newFriendsId: number[] = [];
  blockFriendsId: number[] = [];
  currentNewFriendsId: number[] = [];
  currentBlockFriendsId: number[] = [];
  currentActiveFriendsId: number[] = [];
  currentSenderFriendsId: number[] = [];
  currentAllLike: Like[] = [];
  currentPostLiked: number[] = [];
  mutualFriendsList: Friend[] = [];
  curentLoginUserActiveFriendList: Friend[] = []
  allCmt: Comment[] = [];
  thisPostLike: number

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router, private friendService: FriendListService, private postService: PostService) {
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
        this.currentNewFriendsId    = this.showFriendListIdByIdUserAndStatus(this.currenLogInId, 'New', 'Normal', this.friendList)
        this.currentBlockFriendsId  = this.showFriendListIdByIdUserAndStatus(this.currenLogInId, 'Block', 'Normal', this.friendList)
        this.currentSenderFriendsId = this.showFriendListIdByIdUserAndStatus(this.currenLogInId, 'Sender', 'Normal', this.friendList)
      })
    this.showDit()

    this.postService.getAll().subscribe(
      (data) => {
        this.posts = data;
        this.postService.findAllLike().subscribe(
          (data) => {
            this.currentAllLike = data;
          }
        )
        // this.imgService.getAllImg().subscribe(
        //   (data) => {
        //     console.log(data);
        //     this.imgs = data;
        //
        //
        //   }
        // )

      }
    )
  }

  showDit() {
    this.postService.getAll().subscribe(
      (data) => {
        console.log(data);
        this.posts = data;
        this.postService.findAllLike().subscribe(
          (data) => {
            this.currentAllLike = data;

            this.postService.getAllComment().subscribe(
              (data) => {
                this.allCmt = data;
              }
            )
          }
        )
      }
    )
    this.friendService.getAll().subscribe(
      data => {
        this.friendList = data;
        this.curentLoginUserActiveFriendList=[]

        data.forEach(f=>{
          if (f.source.id==this.currenLogInId){
            this.curentLoginUserActiveFriendList.push(f)
          }
        })
        this.currentActiveFriendsId = this.showFriendListIdByIdUserAndStatus(this.currenLogInId, 'Active', 'Normal', this.friendList)
        this.currentNewFriendsId = this.showFriendListIdByIdUserAndStatus(this.currenLogInId, 'New', 'Normal', this.friendList)
        this.currentBlockFriendsId = this.showFriendListIdByIdUserAndStatus(this.currenLogInId, 'Block', 'Normal', this.friendList)
        this.currentSenderFriendsId = this.showFriendListIdByIdUserAndStatus(this.currenLogInId, 'Sender', 'Normal', this.friendList)
      })
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
      this.currentUserLogin = data
      this.currentUser = data
    });

    this.postService.getAll().subscribe((data) => {
        this.posts = data;
        this.currentPostLiked = []
        this.postService.findAllLike().subscribe(data => {
            this.currentAllLike = data;
            data.forEach(like => {
              if (like.userId == this.currenLogInId) {
                this.currentPostLiked.push(like.postId)
              }
            })

          }
        )
        // this.imgService.getAllImg().subscribe(
        //   (data) => {
        //     console.log(data);
        //     this.imgs = data;
        //
        //
        //   }
        // )

      }
    )
  }

  showFriendListByIdUserAndStatus(id: number, status: string, type: string) {
    this.currentListFriends = []
    for (let i = 0; i < this.friendList.length; i++) {
      if (this.friendList[i].friendshipStatus == status && this.friendList[i].relationshipType == type && this.friendList[i].source.id == id) {
        this.currentListFriends.push(this.friendList[i])
      }
    }
  }
  getFriendList: Friend[]=[]
  getFriendListByIdUserAndStatus(id: number, status: string, type: string) {
    this.getFriendList = []
    for (let i = 0; i < this.friendList.length; i++) {
      if (this.friendList[i].friendshipStatus == status && this.friendList[i].relationshipType == type && this.friendList[i].source.id == id) {
        this.getFriendList.push(this.friendList[i])
      }
    }
    return this.getFriendList;
  }

  showFriendListIdByIdUserAndStatus(id: number, status: string, type: string, listFriend: Friend[]) {
    this.currentListType = []

    for (let i = 0; i < this.friendList.length; i++) {
      if (listFriend[i].friendshipStatus == status && listFriend[i].relationshipType == type && listFriend[i].source.id == id) {
        this.currentListType.push(listFriend[i].target.id)
      }
    }
    return this.currentListType
  }

  fowardToMainTimeLine(id: number) {
    this.router.navigateByUrl("/mainTimeLine/" + id)
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
            this.showDit()
          }
        );
      }
    );
  }

  acceptFiend(sourceId: number, targetId: number, relationshipType: string, friendshipStatus: string) {
    let sourceCancer = -1;
    let targetCancer = -1;
    this.friendList.forEach(f => {
      if (f.target.id == targetId && f.source.id == sourceId) {
        sourceCancer = f.id
      }
      if (f.target.id == sourceId && f.source.id == targetId) {
        targetCancer = f.id
      }
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
    this.friendRequestCancerNoReload(sourceId, targetId)
    // this.friendRequestCancer(targetId,sourceId)
    // console.log(this.friend)
    // @ts-ignore
    this.friendService.addFriend(friend).subscribe((data) => {
        // @ts-ignore
        this.friendService.addFriend(friendTarget).subscribe((data) => {
            this.showDit()
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
    this.friendList.forEach(f => {
      if (f.target.id == targetId && f.source.id == sourceId) {
        sourceCancer = f.id
      }
      if (f.target.id == sourceId && f.source.id == targetId) {
        targetCancer = f.id
      }
    })
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
    this.friendList.forEach(f => {
      if (f.target.id == targetId && f.source.id == sourceId) {
        sourceCancer = f.id
      }
      if (f.target.id == sourceId && f.source.id == targetId) {
        targetCancer = f.id
      }
    })
    // @ts-ignore
    this.friendService.unFriend(sourceCancer).subscribe((data) => {
        this.friendService.unFriend(targetCancer).subscribe((data) => {
            this.showDit()
          }
        );
      }
    );
  }


  Like(postId: number, userId: number, userLastName: string) {
    let flagLike = 0;
    let flagLikeID = -1;
    const like = {
      postId: postId,
      userId: userId,
      userLastName: userLastName,
    };
    this.currentAllLike.forEach(l => {
      if (l.userId == userId && l.postId == postId) {
        flagLike += 1;
        flagLikeID = l.id
      }
    })

    if (flagLike == 0) {
      //@ts-ignore
      this.postService.like(like).subscribe((data) => {
          this.showDit()
        }
      );
    }
    if (flagLike == 1) {
      this.postService.unLike(flagLikeID).subscribe((data) => {
          this.showDit()
        }
      );
    }

  }

  cmt(idPost: number) {
    const cmt = {
      content: this.formCmt.controls["content"].value,
      user: {
        "id": this.currenLogInId
      },
      post: {
        "id": idPost
      }
    };
    // console.log(this.posts)
    // @ts-ignore
    this.postService.comment(cmt).subscribe((data) => {
        this.formCmt.reset();
      },
    );
    this.showDit()
  }

  coutLike(idPost: number) {
    this.thisPostLike = 0;
    for (let i = 0; i < this.currentAllLike.length; i++) {
      if (this.currentAllLike[i].postId == idPost) {
        this.thisPostLike += 1;
      }
    }
    if (this.thisPostLike == 1) {
      return 'You like this post'
    } else if (this.thisPostLike == 0) {
      return 'No one like this post'
    } else
      return (this.thisPostLike - 1 + 'Other like this post')
  }

  DeleteCmt(id: number) {
    this.postService.commentDelete(id).subscribe(() => {
      this.showDit()
    })

  }
mutualTarget: Friend[] =[];
  mutualfriends() {
    this.mutualFriendsList = this.getFriendListByIdUserAndStatus(this.currenLogInId, 'Active', 'Normal')
    this.mutualTarget = this.getFriendListByIdUserAndStatus(this.currentUserId, 'Active', 'Normal')
    console.log(this.currentUserId,this.currenLogInId)
    this.curentLoginUserActiveFriendList=[]

    for (let i = 0; i < this.mutualTarget.length; i++) {
      if (this.mutualFriendsList.includes(this.mutualTarget[i])) {
        this.curentLoginUserActiveFriendList.push(this.mutualTarget[i])
      }
    }
    this.currentListFriends=this.curentLoginUserActiveFriendList
     console.log("mu",this.mutualFriendsList)
     console.log("ac",this.activeFriends)
     console.log("cu",this.curentLoginUserActiveFriendList)
    return this.curentLoginUserActiveFriendList
  }
}
