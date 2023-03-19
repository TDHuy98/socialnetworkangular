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
import {AuthService} from "../auth.service";
import {PostDto} from "../model/Dto/PostDto";
import {data} from "jquery";
import {Comment} from "../model/Comment";
import {CommentDto} from "../model/Dto/CommentDto";
import {FriendDto} from "../model/Dto/FriendDto";

@Component({
  selector: 'app-main-time-line',
  templateUrl: './main-time-line.component.html',
  styleUrls: ['./main-time-line.component.css']
})
export class MainTimeLineComponent implements OnInit {
  formCmt: FormGroup = new FormGroup({
    content: new FormControl(""),
    name: new FormControl(""),
  })
  currentId = Number(localStorage.getItem("userId"));

  // @ts-ignore
  currentUserLogin = JSON.parse(localStorage.getItem("loggedInUser"));
  currenLogInId = this.currentUserLogin.id;
  id: number | undefined;
  currenViewtUser = new User;
  currentUserId = this.currentUserLogin.id;
  friendList: Friend[] = []
  posts: PostDto[] = [];
  @Input() activeFriendsId: number[] = []

  currentListFriends: FriendDto[] = [];
  currentListFriendsId: number[];
  currentListType: FriendDto[];
  curentLoginActiveFriends: FriendDto[] = [];
  curentLoginNewFriends: FriendDto[] = [];
  curentLoginBlockFriends: FriendDto[] = [];
  curentLoginSenderFriends: FriendDto[] = []

  newFriendsId: number[] = [];
  blockFriendsId: number[] = [];
  currentNewFriendsId: number[] = [];
  currentBlockFriendsId: number[] = [];
  currentActiveFriendsId: Number[] = [];
  currentSenderFriendsId: number[] = [];
  currentAllLike: Like[] = [];
  currentPostLiked: number[] = [];
  mutualFriendsList: Friend[] = [];
  curentLoginUserActiveFriendList: Friend[] = []
  allCmt: CommentDto[];
  thisPostLike: number
  currentClickId: number;
  senderFriendsId: number[];

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private router: Router, private friendService: FriendListService,
              private postService: PostService,
              private authService: AuthService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }


  ngOnInit(): void {
    this.curentLoginActiveFriends=[]
    this.curentLoginBlockFriends=[]
    this.curentLoginNewFriends=[]
    this.curentLoginBlockFriends=[]
    this.currentId = Number(localStorage.getItem('currentUserId'))
    this.friendService.getActiveFriendListByIdUser(this.currenLogInId).subscribe(
      data => {
        this.curentLoginActiveFriends = data

        this.friendService.getSendFriendListByIdUser(this.currenLogInId).subscribe(
          data => {
            this.curentLoginSenderFriends = data

            console.log("dc,,", this.curentLoginSenderFriends)
            this.friendService.getNewFriendListByIdUser(this.currenLogInId).subscribe(
              data => {
                this.curentLoginNewFriends = data

                this.friendService.getBlockFriendListByIdUser(this.currenLogInId).subscribe(
                  data => {
                    this.curentLoginBlockFriends = data
                    this.curentLoginActiveFriends.forEach(item=>{
                      this.currentActiveFriendsId.push(item.target.id)
                    })
                    this.curentLoginSenderFriends.forEach(item=>{
                      this.currentSenderFriendsId.push(item.target.id)
                    })
                    this.curentLoginNewFriends.forEach(item=>{
                      this.currentNewFriendsId.push(item.target.id)
                    })
                    this.curentLoginBlockFriends.forEach(item=>{
                      this.currentBlockFriendsId.push(item.target.id)
                    })

                    console.log("nearness test",this.currentSenderFriendsId)
                    this.showOption()
                  }
                )

              }
            )
          }
        )
      }
    )


    this.getListFriendId()
    this.getCurentLoginListFriendId()
    this.showDit()
    console.log("frlist", this.curentLoginSenderFriends)
    console.log("user", this.currentClickId)
  }

  showDit() {
    // @ts-ignore
    this.currentClickId = +this.route.snapshot.paramMap.get('id');
    this.getListFriendId()
    this.getCurentLoginListFriendId()
    this.postService.getAll(this.currentId).subscribe(
      (data) => {
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
    this.curentLoginActiveFriends = this.returnActiveFriend(this.currenLogInId)
    this.curentLoginSenderFriends = this.returnSenderFriend(this.currenLogInId)
    this.curentLoginBlockFriends = this.returnBlockFriend(this.currenLogInId)
    this.curentLoginNewFriends = this.returnNewFriend(this.currenLogInId)

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
      this.currenViewtUser = data
    });

    this.postService.getAll(this.currentId).subscribe((data) => {
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
      }
    )
  }

  loadLike() {
    this.postService.getAll(this.currentId).subscribe(
      (data) => {
        this.posts = data;
        this.postService.findAllLike().subscribe(
          (data) => {
            this.currentAllLike = data;
          }
        )
      }
    )
  }

  userToGet: User;

  getUserByUserId(id: number) {
    this.userService.findById(id).subscribe((data) => {
        this.userToGet = data

      }
    );
    return this.userToGet;
  }

  showFriendListByIdUserAndStatus(id: number, status: string, type: string) {
    this.currentListFriends = []
    for (let i = 0; i < this.friendList.length; i++) {
      if (this.friendList[i].friendshipStatus == status && this.friendList[i].relationshipType == type && this.friendList[i].source.id == id) {
        this.currentListFriends.push(this.friendList[i])
      }
    }
  }

  getFriendList: Friend[] = []

  getFriendListByIdUserAndStatus(id: number, status: string, type: string) {
    this.getFriendList = []
    for (let i = 0; i < this.friendList.length; i++) {
      if (this.friendList[i].friendshipStatus == status && this.friendList[i].relationshipType == type && this.friendList[i].source.id == id) {
        this.getFriendList.push(this.friendList[i])
      }
    }
    return this.getFriendList;
  }


  fowardToMainTimeLine(id: number) {
    this.currentClickId = id;
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
    this.friendRequestCancelNoReload(sourceId, targetId)
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

  cancelFriendRequest(sourceId: number, targetId: number) {
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

  friendRequestCancelNoReload(sourceId: number, targetId: number) {
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
      postId: idPost
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

  mutualTarget: Friend[] = [];

  mutualfriends() {
    this.mutualFriendsList = this.getFriendListByIdUserAndStatus(this.currenLogInId, 'Active', 'Normal')
    this.mutualTarget = this.getFriendListByIdUserAndStatus(this.currentUserId, 'Active', 'Normal')
    this.curentLoginUserActiveFriendList = []

    for (let i = 0; i < this.mutualTarget.length; i++) {
      if (this.mutualFriendsList.includes(this.mutualTarget[i])) {
        this.curentLoginUserActiveFriendList.push(this.mutualTarget[i])
      }
    }
    this.currentListFriends = this.curentLoginUserActiveFriendList
    return this.curentLoginUserActiveFriendList
  }

  getActiveFriend(userId: number) {
    this.friendService.getActiveFriendListByIdUser(userId).subscribe(
      data => {
        this.currentListFriends = data
      }
    )
  }

  getNewFriend(userId: number) {
    this.friendService.getNewFriendListByIdUser(userId).subscribe(
      data => {
        this.currentListFriends = data
      }
    )
  }

  getSenderFriend(userId: number) {
    this.friendService.getSendFriendListByIdUser(userId).subscribe(
      data => {
        this.currentListFriends = data
      }
    )
  }

  getBlockFriend(userId: number) {
    this.friendService.getBlockFriendListByIdUser(userId).subscribe(
      data => {
        this.currentListFriends = data
      }
    )
  }

  loginListActiveFriend: FriendDto[]
  loginListSenderFriend: FriendDto[]
  loginListNewFriend: FriendDto[]
  loginListBlockFriend: FriendDto[]

  returnActiveFriend(userId: number) {
    this.loginListActiveFriend = []
    this.friendService.getBlockFriendListByIdUser(userId).subscribe(
      data => {
        this.loginListActiveFriend = data
      })
    return this.loginListActiveFriend
  }

  returnSenderFriend(userId: number) {
    this.loginListSenderFriend = []
    this.friendService.getSendFriendListByIdUser(userId).subscribe(
      data => {
        this.loginListSenderFriend = data
      })
    console.log("cmm",this.loginListSenderFriend)
    return this.loginListSenderFriend
  }

  returnNewFriend(userId: number) {
    this.loginListNewFriend = []
    this.friendService.getNewFriendListByIdUser(userId).subscribe(
      data => {
        this.loginListNewFriend = data
      })
    return this.loginListNewFriend
  }

  returnBlockFriend(userId: number) {
    this.loginListBlockFriend = []
    this.friendService.getBlockFriendListByIdUser(userId).subscribe(
      data => {
        this.loginListBlockFriend = data
      })
    return this.loginListBlockFriend
  }

  newList: number[] = []

  getIdTargetListFromListFriend(listFriendInput: FriendDto[]) {
    this.newList = [];
    listFriendInput.forEach(f => {
      this.newList.push(f.target.id);
    })
    console.log("newList:",this.newList)
    return this.newList;
  }

  getListFriendId() {
    this.activeFriendsId = this.getIdTargetListFromListFriend(this.returnActiveFriend(this.currenLogInId))
    this.newFriendsId = this.getIdTargetListFromListFriend(this.returnNewFriend(this.currenLogInId))
    this.blockFriendsId = this.getIdTargetListFromListFriend(this.returnBlockFriend(this.currenLogInId))
    this.senderFriendsId = this.getIdTargetListFromListFriend(this.returnSenderFriend(this.currenLogInId))
    console.log("sender",this.returnSenderFriend(this.currenLogInId))
    this.showOption()
  }

  getCurentLoginListFriendId() {
    this.currentActiveFriendsId = this.getIdTargetListFromListFriend(this.returnActiveFriend(this.currenLogInId))
    this.currentNewFriendsId = this.getIdTargetListFromListFriend(this.returnNewFriend(this.currenLogInId))
    this.currentBlockFriendsId = this.getIdTargetListFromListFriend(this.returnBlockFriend(this.currenLogInId))
    this.currentSenderFriendsId = this.getIdTargetListFromListFriend(this.returnSenderFriend(this.currenLogInId))
  }

  showOption() {
    if (this.currentActiveFriendsId.includes(this.currentUserId)) {
      return "Unfriend"
    } else if (this.currentSenderFriendsId.includes(this.currentUserId)) {
      return "Waiting...."
    } else if (this.currentBlockFriendsId.includes(this.currentUserId)) {
      return "Unblock"
    } else if (this.currentNewFriendsId.includes(this.currentUserId)) {
      return "Accept"
    }
  }
}
