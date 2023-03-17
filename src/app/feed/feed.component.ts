import {Component, OnInit} from '@angular/core';
import {PostService} from "../service/post/postService";
import {FormControl, FormGroup, Validators} from "@angular/forms";
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
  currentUserId=Number(localStorage.getItem('userId'))
  postForm: FormGroup[] | any;
  editForm: FormGroup | any;
  yoursPost: Post | undefined;
  posts: Post[] | undefined;

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
    this.postService.findById(id).subscribe((data) => {
      this.yoursPost = data
      this.editForm = new FormGroup({
        // id: new FormControl(data.id),
        // user: new FormGroup({
        //   id: new FormControl(data.user.id)
        // }),
        postStatus: new FormControl(data.postStatus),
        content: new FormControl(data.content),
        img: new FormControl(data.img),
        posts: new FormControl(data.posts)
      })
    })
  }


  creatPost() {
    console.log(this.newPost)
    this.newPost.userId=this.currentUserId;
    this.newPost.content=this.postForm.get("content").value;
    this.newPost.postStatus=this.postForm.get("postStatus").value;
    this.newPost.img=this.postForm.get("img").value;


    this.postService.save(this.newPost).subscribe(() => {
      this.router.navigateByUrl("/feed");
      window.location.reload()
    }, error => {
      alert("lỗi đường truyền")
      this.router.navigateByUrl("/feed")
    })
  }

  edit() {
    this.postService.save(this.editForm.value).subscribe(() => {
      alert("update post success")
      this.router.navigate(["/feed"])
    })
  }


  delete(id: number) {
    alert("Delete Success")
    this.postService.delete(id)
    this.router.navigate(["/feed"])
  }
}
