import {
  Component,
  Input,
  EventEmitter,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef, Inject
} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import 'firebase/storage'
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {Friend} from "../model/friend";
import {User} from "../model/User";
import {UserService} from "../service/user.service";
import {FriendListService} from "../service/friend-list.service";
import {PostService} from "../service/post.service";

import {Like} from '../model/Like';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {PostDto} from "../model/Dto/PostDto";

import {CommentDto} from "../model/Dto/CommentDto";
import {FriendDto} from "../model/Dto/FriendDto";
import {finalize} from "rxjs";
import {PostServicek} from "../service/post/postServicek";
import {NewPost} from "../model/Dto/newPost";

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
  currentId = Number(localStorage.getItem("userId"));

  loggedInUser: User = new User();

  currenLogInId = Number(localStorage.getItem("userId"));
  id: number | undefined;
  currenViewtUser = new User;
  friendList: Friend[] = []
  posts: PostDto[] = [];
  @Input() activeFriendsId: number[] = []
  currentListFriends: FriendDto[] = [];
  curentLoginActiveFriends: FriendDto[] = [];
  curentLoginNewFriends: FriendDto[] = [];
  curentLoginBlockFriends: FriendDto[] = [];
  curentLoginSenderFriends: FriendDto[] = []
  postForm: FormGroup[] | any;
  editForm: FormGroup | any;
  newFriendsId: number[] = [];
  blockFriendsId: number[] = [];
  currentNewFriendsId: number[] = [];
  currentBlockFriendsId: number[] = [];
  currentActiveFriendsId: Number[] = [];
  currentSenderFriendsId: number[] = [];
  currentAllLike: Like[] = [];
  currentPostLiked: number[] = [];
  allCmt: CommentDto[];
  thisPostLike: number
  currentClickId: number;
  senderFriendsId: number[];
  targetActiveFriendList: Friend[] = [];
  targetSenderFriendList: Friend[] = [];
  targetBlockFriendList: Friend[] = [];
  targetNewFriendList: Friend[] = [];

  constructor(private route: ActivatedRoute,
              @Inject(AngularFireStorage)
              private storage: AngularFireStorage,
              private postServicek: PostServicek,
              private userService: UserService,
              private router: Router, private friendService: FriendListService,
              private postService: PostService,
              private authService: AuthService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // @ts-ignore
    this.currentClickId = +this.route.snapshot.paramMap.get('id');


  }

  @ViewChild('uploadFile', {static: true}) public avatarDom: ElementRef | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');


  }


  ngOnInit(): void {
    this.curentLoginActiveFriends = []
    this.curentLoginBlockFriends = []
    this.curentLoginNewFriends = []
    this.curentLoginBlockFriends = []
    this.currentId = Number(localStorage.getItem('currentUserId'))


    this.postService.getAll(this.currentId).subscribe(
      (data) => {
        console.log('postService getALl 1')
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


    //get clicked in user id
    this.userService.findById(this.currentClickId).subscribe(data => {
      this.loggedInUser = data;
      this.currentClickId = data.id
    })


    this.friendService.getActiveFriendListByIdUser(this.currenLogInId).subscribe(
      data => {
        this.curentLoginActiveFriends = data

        this.friendService.getSendFriendListByIdUser(this.currenLogInId).subscribe(
          data => {
            this.curentLoginSenderFriends = data

            // console.log("dc,,", this.curentLoginSenderFriends)
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
    this.showDit()
    this.postForm = new FormGroup({
      content: new FormControl("content"),
      postStatus: new FormControl("postStatus", Validators.required),
      img: new FormControl(""),
      posts: new FormControl(""),
    })


    this.editForm = new FormGroup({
      id: new FormControl("id"),
      postStatus: new FormControl("postStatus"),
      content: new FormControl("content", Validators.required),
      img: new FormControl("img"),
    })
  }

  showDit() {
    // @ts-ignore
    this.currentClickId = +this.route.snapshot.paramMap.get('id');


    this.curentLoginActiveFriends = this.returnActiveFriend(this.currenLogInId)
    this.curentLoginSenderFriends = this.returnSenderFriend(this.currenLogInId)
    this.curentLoginBlockFriends = this.returnBlockFriend(this.currenLogInId)
    this.curentLoginNewFriends = this.returnNewFriend(this.currenLogInId)

    // @ts-ignore
    this.currentId = +this.route.snapshot.paramMap.get('id');
    // @ts-ignore
    this.currentClickId = +this.route.snapshot.paramMap.get('id');
    if (this.currentId == 0) {
      this.currentId = this.currenLogInId
    }
    if (this.currentClickId == 0) {
      this.currentId = this.currenLogInId
    }
    this.userService.findById(this.currentId).subscribe(data => {
      this.currenViewtUser = data
    });

    this.postService.getAll(this.currentId).subscribe((data) => {
        console.log('postService getALl 2')
        this.posts = data;
        this.currentPostLiked = []
        this.postService.findAllLike().subscribe(data => {
            this.currentAllLike = data;
            console.log("this is all like data " + JSON.stringify(data))
            data.forEach(like => {
              if (like.userId == this.currenLogInId) {
                this.currentPostLiked.push(like.postId)
              }
            })
            console.log(this.currentPostLiked)
            this.postService.getAllComment().subscribe(
              (data) => {
                this.allCmt = data;
              }
            )
          }
        )
      }
    )
  }

  // loadLike() {
  //   this.postService.getAll(this.currentId).subscribe(
  //     (data) => {
  //       console.log('load like')
  //       this.posts = data;
  //       this.postService.findAllLike().subscribe(
  //         (data) => {
  //           this.currentAllLike = data;
  //         }
  //       )
  //     }
  //   )
  // }

  showFriendListByIdUserAndStatus(id: number) {
    this.currentListFriends = []
    this.friendService.getActiveFriendListByIdUser(id).subscribe(data => {
      this.currentListFriends = data
    })
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

  friendRequestCancel(sourceId: number, targetId: number) {
    let sourceCancel = -1;
    let targetCancel = -1;
    this.curentLoginActiveFriends.forEach(f => {
      if (f.target.id == targetId && f.source.id == sourceId) {
        sourceCancel = f.id
      }
      if (f.target.id == sourceId && f.source.id == targetId) {
        targetCancel = f.id
      }
    })
    // @ts-ignore
    this.friendService.unFriend(sourceCancel).subscribe((data) => {
        this.friendService.unFriend(targetCancel).subscribe((data) => {
            this.showDit()
          }
        );
      }
    );
  }


  Like(postId: number, userId: number, userLastName: string) {
    console.log('current post like ' + this.currentPostLiked)
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
          // this.showDit()
          this.postService.findAllLike().subscribe(data => {
              this.currentAllLike = data;
              console.log('currentAllLike data ' + JSON.stringify(this.currentAllLike))
              data.forEach(like => {
                if (like.userId == this.currenLogInId) {
                  this.currentPostLiked.push(like.postId)
                  console.log('currentPostLiked after like ' + this.currentPostLiked)
                }
              })

            }
          )
        }
      );
    } else {
      this.postService.findAllLike().subscribe(data => {
          this.currentAllLike = data;
          data.forEach(like => {
            if (like.userId == this.currenLogInId) {
              this.currentPostLiked.splice(this.currentPostLiked.indexOf(like.postId), 1)
              console.log('current post liked after splice ' + this.currentPostLiked)
            }
          }),
            this.postService.unLike(flagLikeID).subscribe((data) => {
                // this.showDit()
                console.log('dislike this post ' + like.postId)
                this.postService.findAllLike().subscribe(data => {
                    this.currentAllLike = data;
                  }
                )
              }
            );
        }
      )

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
    // this.showDit()
    this.postService.getAllComment().subscribe(
      (data) => {
        this.allCmt = data;
      }
    )
  }

  coutLike(idPost: number) {
    this.thisPostLike = 0;
    for (let i = 0; i < this.currentAllLike.length; i++) {
      if (this.currentAllLike[i].postId == idPost) {
        this.thisPostLike += 1;
      }
    }
    // if (this.thisPostLike == 1) {
    //   return 'You like this post'
    // } else if (this.thisPostLike == 0) {
    //   return 'No one like this post'
    // } else
    return (this.thisPostLike + ' People like this post')
  }

  DeleteCmt(id: number) {
    this.postService.commentDelete(id).subscribe(() => {
      this.showDit()
    })

  }


  getTargetActiveFriend(userId: number) {
    this.friendService.getActiveFriendListByIdUser(userId).subscribe(
      data => {
        this.targetActiveFriendList = data
        this.currentListFriends = data
      }
    )
  }

  getTargetNewFriend(userId: number) {
    this.friendService.getNewFriendListByIdUser(userId).subscribe(
      data => {
        this.targetNewFriendList = data
        this.currentListFriends = data

      }
    )
  }

  getTargetSenderFriend(userId: number) {
    this.friendService.getSendFriendListByIdUser(userId).subscribe(
      data => {
        this.targetSenderFriendList = data
        this.currentListFriends = data

      }
    )
  }

  getTargetBlockFriend(userId: number) {
    this.friendService.getBlockFriendListByIdUser(userId).subscribe(
      data => {
        this.targetBlockFriendList = data
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
    console.log("cmm", this.loginListSenderFriend)
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

  creatPost() {
    const filePath = this.selectedImage.name;
    const fileRef = this.storage.ref(filePath);
    this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
      finalize(() => (fileRef.getDownloadURL().subscribe(url => {
        this.ArrayPicture = url;
        console.log("picture " + url)
        this.newPost.userId = this.currentLoggedInUserId;
        this.newPost.content = this.postForm.get("content").value;
        this.newPost.postStatus = this.postForm.get("postStatus").value;
        this.newPost.img = url
        this.postServicek.save(this.newPost).subscribe(() => {
          console.log("success")
          this.router.navigateByUrl("/feed");
          window.location.reload();
        })
      })))
    ).subscribe()
  }

  currentLoggedInUserId = Number(localStorage.getItem('userId'))

  selectedImage: any = null;
  newPost: NewPost = new NewPost()

  ArrayPicture = "";

  upload() {
    this.selectedImage = this.avatarDom?.nativeElement.files[0];
  }

  edit() {
    this.postServicek.save(this.editForm.value).subscribe(() => {
      alert("update post success")
      this.router.navigate(["/feed"])
    })
  }


  delete(id: number) {
    alert("Delete Success")
    this.postService.delete(id).subscribe(() => {
      alert("delete succes")
      this.router.navigate(["/feed"])
    }, error => {
      alert("delete false")
    })

  }
}
