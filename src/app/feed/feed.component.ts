import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {PostService} from "../service/post/postService";
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

  newPost: NewPost=new NewPost()

  constructor(private postService: PostService, private router: Router, private route: ActivatedRoute,@Inject(AngularFireStorage) private  storage : AngularFireStorage) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

      this.postService.findAllByUser_Id(this.currentLoggedInUserId).subscribe(data => {
        this.posts= data
      },error => {
        alert("false")
      })

  }


  ngOnInit() {



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


  creatPost() {
    const filePath = this.selectedImage.name;
    const fileRef = this.storage.ref(filePath);
    this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
      finalize(()=> (fileRef.getDownloadURL().subscribe(url =>{
        this.ArrayPicture = url;
        alert(this.currentLoggedInUserId)
        console.log("picture " + url)
        this.newPost.userId = this.currentLoggedInUserId;
        this.newPost.content= this.postForm.get("content").value;
        this.newPost.postStatus=this.postForm.get("postStatus").value;
        this.newPost.img = url
        this.postService.save(this.newPost).subscribe(()=>{
          console.log("success")
          this.router.navigateByUrl("/feed");
          // window.location.reload();
        })
      })))
    ).subscribe()


      // const nameImg = this.getCurrentDateTime() + this.selectedImage.name
      // const fileRef =this.storage.ref(nameImg);
      // this.storage.upload(nameImg,this.selectedImage).snapshotChanges().pipe(
      //   finalize( ()=> {
      //     fileRef.getDownloadURL().subscribe((url) =>{
      //       console.log('test' + url)
      //       this.newPost.userId = this.currentUserId;
      //       this.newPost.content = this.postForm.get("content").value;
      //       this.newPost.postStatus = this.postForm.get("postStatus").value;
      //       this.newPost.img = url;
      //
      //       console.log(this.newPost)
      //       this.postService.save(this.newPost).subscribe(() => {
      //         console.log(this.postForm.value)
      //         alert("success")
      //         this.router.navigateByUrl("/feed")
      //         window.location.reload()
      //       },error => {
      //         alert("false")
      //       })
      //     })
      //   })
      // )
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
}
