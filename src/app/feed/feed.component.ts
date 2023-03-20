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
  newPost: NewPost=new NewPost()

  constructor(private postService: PostServicek,
              private router: Router,
              private route: ActivatedRoute,
              @Inject(AngularFireStorage) private  storage : AngularFireStorage, private userService: UserService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

      this.postService.findAllByUser_Id(this.currentLoggedInUserId).subscribe(data => {
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
        alert("false")
      })
    this.userService.findById(Number(localStorage.getItem('userId'))).subscribe(
      data => {
        console.log(data);
        this.currentUser = data;
        this.loggedInUser = data;

        localStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUser))
      }
    )

  }
  formCmt: FormGroup = new FormGroup({
    content: new FormControl(""),
    name: new FormControl(""),
  })
  currentUser:User;
  loggedInUser:User;

  ngOnInit() {

    this.userService.findById(Number(localStorage.getItem('userId'))).subscribe(
      data => {
        console.log(data);
        this.currentUser = data;
        this.loggedInUser = data;

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
      content: new FormControl("content"),
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
    this.postService.findAllByUser_Id(this.currentLoggedInUserId).subscribe(data => {
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
      alert("false")
    })
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
    this.showPost()
  }


  DeleteCmt(id: number) {
    this.postService.commentDelete(id).subscribe(() => {
      this.showPost()
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
          this.router.navigateByUrl("/feed");
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
      alert("update post success")
      this.router.navigate(["/feed"])
    })
  }


  delete(id: number) {
    alert("Delete Success")
    this.postService.delete(id).subscribe(() =>{
      alert("delete succes")
      this.router.navigate(["/feed"])
    },error => {
      alert("delete false")
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
