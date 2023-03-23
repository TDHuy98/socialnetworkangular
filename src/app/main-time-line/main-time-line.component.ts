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
import {Notifications} from "../model/Dto/Notifications";
import {data} from "jquery";

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
  formEditCmt: FormGroup = new FormGroup({
    content: new FormControl(""),
    id: new FormControl(""),
    postId: new FormControl(""),

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
    this.loadloginListFr();
    this.loadTargetListFr(this.currentClickId);
    this.showDit()
    this.loadNotice(this.loggedInUser.id)
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
    // @ts-ignore
    this.currentId = +this.route.snapshot.paramMap.get('id');
    // @ts-ignore
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

  loadTargetListFr(userId: number) {
    this.friendService.getBlockFriendListByIdUser(userId).subscribe(
      data => {
        this.targetBlockFriendList = data
      }
    )
    this.friendService.getActiveFriendListByIdUser(userId).subscribe(
      data => {
        this.targetActiveFriendList = data

      }
    )
    this.friendService.getNewFriendListByIdUser(userId).subscribe(
      data => {
        this.targetNewFriendList = data

      }
    )
    this.friendService.getSendFriendListByIdUser(userId).subscribe(
      data => {
        this.targetSenderFriendList = data
        console.log("cmm", this.targetSenderFriendList)

      }
    )
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
        this.loadloginListFr()
        this.loadTargetListFr(targetId)
        // @ts-ignore
        this.friendService.addFriend(friendTarget).subscribe((data) => {
            this.showDit()
            this.loadloginListFr()
            this.loadTargetListFr(targetId)
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
    this.friendRequestDeny(sourceId, targetId)
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


  friendRequestDeny(sourceId: number, targetId: number) {
    this.loadloginListFr()
    this.loadTargetListFr(targetId)
    this.currentNewFriendsId.splice(this.currentNewFriendsId.indexOf(targetId), 1);
    let source = -1;
    let target = -1;
    console.log(sourceId, targetId)
    console.log("2list", this.curentLoginNewFriends, this.targetSenderFriendList)
    this.curentLoginNewFriends.forEach(f => {
      if (f.target.id == targetId && f.source.id == sourceId) {
        source = f.id
      }
    })
    this.targetSenderFriendList.forEach(f => {
      if (f.target.id == sourceId && f.source.id == targetId) {
        target = f.id
      }
    })
    console.log("s,t", source, target)
    console.log('1 ' + this.currentNewFriendsId)

    this.friendService.unFriend(source).subscribe((data) => {
        console.log('2 ' + this.currentNewFriendsId)
        this.loadTargetListFr(targetId)
        this.loadloginListFr()
        this.friendService.unFriend(target).subscribe((data) => {
            console.log('3 ' + this.currentNewFriendsId)
            this.loadTargetListFr(targetId)
            this.loadloginListFr()

          }
        );
      }
    );

  }

//Huỷ kết bạn
  unFriend(sourceId: number, targetId: number) {
    this.loadloginListFr()
    this.loadTargetListFr(targetId)
    let source = -1;
    let target = -1;
    this.curentLoginNewFriends.forEach(f => {
      if (f.target.id == targetId && f.source.id == sourceId) {
        source = f.id
      }
    })
    this.targetSenderFriendList.forEach(f => {
      if (f.target.id == sourceId && f.source.id == targetId) {
        target = f.id
      }
    })


    this.friendService.unFriend(source).subscribe((data) => {
        this.loadloginListFr()
        this.loadTargetListFr(targetId)
        this.friendService.unFriend(target).subscribe((data) => {
            this.loadloginListFr()
            this.loadTargetListFr(targetId)
          }
        );
      }
    );

  }

  // Huỷ lời mời kết bạn
  cancelRequest(sourceId: number, targetId: number) {
    this.loadloginListFr()
    this.loadTargetListFr(targetId)
    let sourceCancel = -1;
    let targetCancel = -1;
    this.curentLoginSenderFriends.forEach(f => {
      if (f.target.id == targetId && f.source.id == sourceId) {
        sourceCancel = f.id
      }
    })
    this.targetNewFriendList.forEach(f => {
      if (f.target.id == sourceId && f.source.id == targetId) {
        targetCancel = f.id
      }
    })

    this.friendService.unFriend(sourceCancel).subscribe((data) => {
        this.loadloginListFr()
        this.loadTargetListFr(targetId)
        this.friendService.unFriend(targetCancel).subscribe((data) => {
            this.loadloginListFr()
            this.loadTargetListFr(targetId)
          }
        );
      }
    );
  }


  Like(postId: number, userId: number, userLastName: string, userIdRevNotice: number, actionAvartar: string,) {
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
          let flag = 0;
          if (this.loggedInUser.id != userIdRevNotice){
            // this.showDit()
            // Tạo thông báo sau khi like
            this.postService.getAllNotices(this.loggedInUser.id).subscribe(
              data => {
                data.forEach(item => {
                  if (item.postId == postId && item.type == 'like') {
                    flag += 1;
                  }
                })
                if (flag == 0) {
                  this.creatNotice("like your post", userIdRevNotice, postId, "Uncheck", actionAvartar, "like", userLastName)
                }
              }
            )
          }



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
      //xóa phần tử post ID unlike ra khỏi mảng
      this.postService.findAllLike().subscribe(data => {
          this.currentAllLike = data;
          data.forEach(like => {
            if (like.userId == this.currenLogInId) {
              this.currentPostLiked.splice(this.currentPostLiked.indexOf(like.postId), 1)
              console.log('current post liked after splice ' + this.currentPostLiked)
            }
          }),
            //tiến hành xóa like bên BE
            this.postService.unLike(flagLikeID).subscribe((data) => {
                // this.showDit()
                console.log('dislike this post ' + like.postId)
                this.postService.findAllLike().subscribe(data => {
                    this.currentAllLike = data;  //lấy lại giá trị cho currentAllLike để đếm countLike
                  }
                )
              }
            );
        }
      )

    }

  }

  cmt(idPost: number, contentNotice: string, status: string, userCmtAvatar: string, type: string, userId: number, nameAction: string) {
    const cmt = {
      content: this.formCmt.controls["content"].value,
      user: {
        "id": this.currenLogInId
      },
      postId: idPost
    };
    //Tao thong bao khi cmt
    if (this.loggedInUser.id!=userId){
      this.creatNotice("cmt your post", userId, idPost, "Uncheck", userCmtAvatar, "cmt", nameAction)

    }


    // console.log(this.posts)
    // @ts-ignore
    this.postService.comment(cmt).subscribe((data) => {
        this.formCmt.reset();
        this.postService.getAllComment().subscribe(
          (data) => {
            this.allCmt = data;
          }
        )
      },
    );
  }

  coutLike(idPost: number) {
    this.thisPostLike = 0;
    for (let i = 0; i < this.currentAllLike.length; i++) {
      if (this.currentAllLike[i].postId == idPost) {
        this.thisPostLike += 1;
      }
    }
    return (this.thisPostLike + ' People like this post')
  }

  DeleteCmt(id: number) {
    this.postService.commentDelete(id).subscribe(() => {
      this.postService.getAllComment().subscribe(
        (data) => {
          this.allCmt = data;
        }
      )
    })

  }
  creatPost() {
    const filePath = this.selectedImage.name;
    const fileRef = this.storage.ref(filePath);
    this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
      finalize(()=> (fileRef.getDownloadURL().subscribe(url =>{
        this.ArrayPicture = url;
        console.log("picture " + url)
        this.newPost.userId = this.currentLoggedInUserId;
        this.newPost.content= this.postForm.get("content").value;
        this.newPost.postStatus=this.postForm.get("postStatus").value;
        this.newPost.img = url
        this.postService.create(this.newPost).subscribe(()=>{
          console.log("success")
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
          )        })
      })))
    ).subscribe()
  }

  upload(){
    this.selectedImage = this.avatarDom?.nativeElement.files[0];
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

  returnNewFriend(userId: number): FriendDto[] {
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



  currentLoggedInUserId = Number(localStorage.getItem('userId'))

  selectedImage: any = null;
  newPost: NewPost = new NewPost()

  ArrayPicture = "";



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

  Edit(idComment: number, idPost: number) {
    const cmt = {
      id: idComment,
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
        this.postService.getAllComment().subscribe(
          (data) => {
            this.allCmt = data;
          }
        )
      },
    );
  }

  getEditComment(id: number, content: string, postId: number) {
    this.idCommetToEdit = id
    this.contentToEdit = content
    this.postIdToEdit = postId
  }

  idCommetToEdit: number
  contentToEdit: string
  postIdToEdit: number

//Chưa chạy đâu anh ơi
  editComment() {
    const cmt = {
      id: this.idCommetToEdit,
      content: this.contentToEdit,
      user: {
        "id": this.currenLogInId
      },
      postId: this.postIdToEdit
    };
    // console.log(this.posts)
    // @ts-ignore
    this.postService.comment(cmt).subscribe((data) => {
        this.formCmt.reset();
        this.postService.getAllComment().subscribe(
          (data) => {
            this.allCmt = data;
          }
        )
      },
    );
  }

  count = 0

  countCmt(id: number) {
    this.count = 0;
    this.allCmt.forEach((cmt) => {
      if (cmt.postId === id) {
        this.count += 1;
      }
    })
    return " " + this.count + " comments"
  }

  notices: Notifications[];

  loadNotice(idUser: number) {
    this.postService.getAllNotices(idUser).subscribe(
      data => {
        this.notices = data;
      }
    )
  }
  countnotice: number = 0;

  countNotice() {
    this.countnotice=0;
    this.postService.getAllNotices(this.loggedInUser.id).subscribe(
      data => {
        data.forEach(item => {
          if (item.status =='Uncheck')
            this.countnotice+=1;
        })
      }
    )
    return this.countnotice
  }

  creatNotice(content: string, idUser: number, idPost: number, status: string, userAvatar: string, type: string, name: string) {
    const notice = {
      content: content,
      postId: idPost,
      userId: idUser,
      status: status,
      targetAvatar: userAvatar,
      type: type,
      userLastName: name,

    };
    console.log("notice: ", notice);
    // @ts-ignore
    this.postService.createNotications(notice).subscribe((data) => {
        this.postService.getAllNotices(this.loggedInUser.id).subscribe(
          (data) => {
            this.notices = data;
            this.loadNotice(this.loggedInUser.id)
          }
        )
      },
    );
  }
}
