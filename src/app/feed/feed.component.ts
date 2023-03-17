import {Component, OnInit} from '@angular/core';
import {PostService} from "../service/post/postService";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserToken} from "../model/UserToken";
import {Post} from "../model/Post";
import {ActivatedRoute, Router} from "@angular/router";
import {PostStatus} from "../model/PostStatus";
import {NewPost} from "../model/Dto/newPost";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  currentLoggedInUserId=Number(localStorage.getItem('userId'))
  postForm: FormGroup[] | any;
  userToken: UserToken | any;
  editForm: FormGroup | any;
  yoursPost: Post | undefined;
  posts: Post[] | undefined;
  selectedImage: any = null;
  currentUserId=Number(localStorage.getItem('userId'))
  @ViewChild('uploadFile',{static:true}) public avatarDom : ElementRef | undefined ;
  ArrayPicture = "";

  newPost: NewPost

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
        posts: new FormControl(data.posts)
      })
    })
  }


  creatPost() {
    const filePath = this.selectedImage.name;
    const fileRef = this.storage.ref(filePath);
    this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
      finalize(()=> (fileRef.getDownloadURL().subscribe(url =>{
        this.ArrayPicture = url;
        console.log("picture " + url)
        this.newPost.userId = this.currentUserId;
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
