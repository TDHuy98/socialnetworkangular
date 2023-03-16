import {Component, Inject, OnInit} from '@angular/core';
import {PostService} from "../service/post/postService";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Post} from "../model/Post";
import {ActivatedRoute, Router} from "@angular/router";
import {PostStatus} from "../model/PostStatus";
import {Token} from "../model/Token";
import {formatDate} from "@angular/common";
import {finalize} from "rxjs";
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage'
import {AngularFireStorage} from "@angular/fire/compat/storage";
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  id: number | any;
  postForm: FormGroup[] | any;
  userToken: Token | any;
  editForm: FormGroup | any;
  yoursPost: Post | undefined;
  posts: Post[] | undefined;
  selectedImage: any = null;


  constructor(private postService: PostService, private router: Router, private route: ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.newPost = {
      userId:1,
      content: '',
      postStatus: PostStatus.Public,
      img: ''
    }
      this.postService.findAllByUser_Id(this.currentUserId).subscribe(data => {
        this.posts= data
      },error => {
        alert("false")
      })

  }


  ngOnInit() {



    this.postForm = new FormGroup({
      content: new FormControl("content", Validators.required),
      postStatus: new FormControl("postStatus"),
      img: new FormControl("img"),
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
        posts: new FormControl(data.posts)
      })
    })
  }


  post() {

    const nameImg = this.getCurrentDateTime() + this.selectedImage.name
    const fileRef =this.storage.ref(nameImg);
    this.storage.upload(nameImg,this.selectedImage).snapshotChanges().pipe(
      finalize( ()=> {
        fileRef.getDownloadURL().subscribe((url) =>{
          this.postForm.patchValue({img : url});
          this.postService.save(this.postForm.value).subscribe(() => {
            console.log(this.postForm.value)
            alert("success")
            this.router.navigate(["/feed"])
          },error => {
            alert("false")
          })
        })
      })
    )
    // console.log(this.postForm.value)
    // alert("Post Was add")
    //
    // this.postService.save(this.postForm.value).subscribe(() => {
    //   this.router.navigate(["/feed"])
    // }, error => {
    //   alert("lỗi đường truyền")
    //   this.router.navigate(["/feed"])
    // })
  }

  showReview(event : any){
    this.selectedImage=event.targer.files[0];
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
}
