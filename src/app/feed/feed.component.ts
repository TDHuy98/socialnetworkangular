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
  // @ts-ignore
  id=Number.parseInt(localStorage.getItem('userId'))
  postForm: FormGroup[] | any;
  userToken: UserToken | any;
  editForm: FormGroup | any;
  yoursPost: Post | undefined;
  posts: Post[] | undefined;

  newPost: NewPost

  constructor(private postService: PostService, private router: Router, private route: ActivatedRoute) {
    this.newPost = {
      content: '',
      postStatus: PostStatus.Public,
      img: ''
    }
      this.postService.findAllByUser_Id(this.id).subscribe(data => {
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
    this.id = id
    this.postService.findById(this.id).subscribe((data) => {
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
    console.log(this.postForm.value)
    this.newPost.content=this.postForm.get("content").value;
    this.newPost.postStatus=this.postForm.get("postStatus").value;
    this.newPost.img=this.postForm.get("img").value;


    this.postService.save(this.newPost).subscribe(() => {
      this.router.navigate(["/feed"])
    }, error => {
      alert("lỗi đường truyền")
      this.router.navigate(["/feed"])
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
