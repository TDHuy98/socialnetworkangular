import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {PostServicek} from "../service/post/postServicek";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Post} from "../model/Post";
import {ActivatedRoute, Router} from "@angular/router";
import {PostStatus} from "../model/PostStatus";
import {NewPost} from "../model/Dto/newPost";
import {formatDate} from "@angular/common";
import {finalize} from "rxjs";
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage'
import {AngularFireStorage} from "@angular/fire/compat/storage";
import * as url from "url";
import {PostDto} from "../model/Dto/PostDto";
import {UserService} from "../service/user.service";
import {User} from "../model/User";
import {MainTimeLineComponent} from "../main-time-line/main-time-line.component";
import {Like} from "../model/Like";
import {CommentDto} from "../model/Dto/CommentDto";
import {Notifications} from "../model/Dto/Notifications";
import {PostService} from "../service/post.service";
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  currentLoggedInUserId=Number(localStorage.getItem('userId'))
  postForm: FormGroup[] | any;
  editForm: FormGroup | any;
  yoursPost: PostDto | undefined;
  posts: PostDto[] | undefined;
  selectedImage: any = null;
  @ViewChild('uploadFile',{static:true}) public avatarDom : ElementRef | undefined ;
  ArrayPicture = "";
  currentPostLiked: number[] = [];
  allCmt: CommentDto[];
  thisPostLike: number
  newPost: NewPost = new NewPost()
   currentNewFriendsId: any[];
   currentSenderFriendsId: any[];
   currentBlockFriendsId: any;

  constructor(private postService: PostServicek,
              private router: Router,
              private route: ActivatedRoute,
              private postServicec: PostService,
              private friendService: FriendListService,
              private route: ActivatedRoute,
              @Inject(AngularFireStorage) private storage: AngularFireStorage, private userService: UserService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

      this.postService.feed(this.currentLoggedInUserId).subscribe(data => {
        this.posts= data
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
      },error => {
      })
    this.userService.findById(Number(localStorage.getItem('userId'))).subscribe(
      data => {
        console.log(data);
        this.currentUser = data;
        this.loggedInUser = data;
        this.loadloginListFr()

        localStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUser))
      }
    )

  }
  formCmt: FormGroup = new FormGroup({
    content: new FormControl(""),
    name: new FormControl(""),
  })
  currentUser: User;
  curentLoginActiveFriends: FriendDto[] = [];
  curentLoginNewFriends: FriendDto[] = [];
  curentLoginBlockFriends: FriendDto[] = [];
  curentLoginSenderFriends: FriendDto[] = [];
  loggedInUser: User;

  ngOnInit() {
    this.loadNotice(Number(localStorage.getItem('userId')))
    this.userService.findById(Number(localStorage.getItem('userId'))).subscribe(
      data => {
        console.log(data);
        this.currentUser = data;
        this.loggedInUser = data;
        this.loadloginListFr()
        localStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUser))
      }
    )
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
    this.postForm = new FormGroup({
      content: new FormControl(""),
      postStatus: new FormControl("postStatus",Validators.required),
      img: new FormControl(""),
      posts: new FormControl(""),
    })


    this.editForm =new FormGroup({
      id: new FormControl("id"),
      postStatus: new FormControl("postStatus"),
      content: new FormControl("content",Validators.required),
      img : new FormControl("img"),
    })


  }

  currentActiveFriendsId: Number[] = [];



  showEdit(id: number) {
    alert("ok")
    this.postService.findById(id).subscribe((data) => {
      this.editForm = new FormGroup({
        id:new FormControl(data.id),
        postStatus: new FormControl(data.postStatus),
        content: new FormControl(data.content),
        img: new FormControl(data.img),
        posts: new FormControl(data.postId)
      })
    })
  }

  showPost(){
    this.postService.feed(this.currentLoggedInUserId).subscribe(data => {
      this.posts= data
      this.currentPostLiked = []
      this.postService.findAllLike().subscribe(data => {
          this.currentAllLike = data;
          data.forEach(like => {
            this.postService.getAllComment().subscribe(
              (data) => {
                this.allCmt = data;
              }
            )
            if (like.userId == this.currenLogInId) {
              this.currentPostLiked.push(like.postId)
            }
          })

        }
      )
    },error => {
    })
  }

  Like(postId: number, userId: number, userLastName: string,userIdRevNotice:number,actionAvartar:string) {
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
        let flag =0;

        if (this.loggedInUser.id != userIdRevNotice){
          // this.showDit()
          // Tạo thông báo sau khi like
          this.postServicec.getAllNotices(this.loggedInUser.id).subscribe(
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
  creatNotice(content: string, idUser: number, idPost: number, status: string, userAvatar: string, type: string, name: string) {
    const notice = {
      content: content,
      userId: idUser,
      postId: idPost,
      status: status,
      targetAvatar: userAvatar,
      type: type,
      userLastName: name,

    };
    console.log("notice: ", notice);
    // @ts-ignore
    this.postServicec.createNotications(notice).subscribe((data) => {
        this.postServicec.getAllNotices(this.loggedInUser.id).subscribe(
          (data) => {
            this.notices = data;
            this.loadNotice(this.loggedInUser.id)
          }
        )
      },
    );
  }
  loadNotice(idUser: number) {
    this.postServicec.getAllNotices(idUser).subscribe(
      data => {
        this.notices = data;
      }
    )
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
  cmt(idPost: number, contentNotice: string, status: string, userCmtAvatar: string, type: string, userRevId: number, nameAction: string) {
    const cmt = {
      content: this.formCmt.controls["content"].value,
      user: {
        "id": this.currenLogInId
      },
      postId: idPost
    };
    //Tạo thông báo sau khi cmt
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
        this.postService.save(this.newPost).subscribe(()=>{
          console.log("success")
          window.location.reload();
        })
      })))
    ).subscribe()
  }

  upload(){
    this.selectedImage = this.avatarDom?.nativeElement.files[0];
  }

  edit() {
    this.postService.save(this.editForm.value).subscribe(() => {
      this.router.navigate(["/feed"],{onSameUrlNavigation:"reload"})
    })
  }


  delete(id: number) {
    this.postService.delete(id).subscribe(() =>{
      this.router.navigate(["/feed"])
    },error => {
    })

  }

  getCurrentDateTime() : string {
    return formatDate(new Date(),'dd-MM-yyyyhhmmssa','en-US');
  }
  currenLogInId = Number(localStorage.getItem("userId"));
  currentAllLike: Like[] = [];
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
}
