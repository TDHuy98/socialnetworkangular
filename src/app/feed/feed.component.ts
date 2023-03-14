import {Component, OnInit} from '@angular/core';
import {PostService} from "../service/post/postService";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserToken} from "../model/UserToken";
import {Post} from "../model/Post";
import {ActivatedRoute, Router} from "@angular/router";
import {PostStatus} from "../model/PostStatus";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  id: number | any;
  postForm: FormGroup[] | any;
  userToken: UserToken | any;
  editForm: FormGroup | any;
  yoursPost: Post | undefined;
  posts: Post[] | undefined;


  constructor(private postService: PostService, private router: Router, private route: ActivatedRoute) {


  }


  ngOnInit() {


    this.postService.findAllByUser_Id(this.id)


    this.postForm = new FormGroup({
      id: new FormControl(0),
      user: new FormGroup({
        id: new FormControl(1)
      }),
      content: new FormControl("content", Validators.required),
      postStatus: new FormControl("1"),
      img: new FormControl("upLoadFile"),
      posts: new FormControl(""),
      createAT: new FormControl(Date.now()),
      updateAT: new FormControl("")
    })


    this.editForm =new FormGroup({
      id: new FormControl("id"),
      user: new FormGroup({
        id: new FormControl("idUser",Validators.required)
      }),
      content: new FormControl("content",Validators.required),
      img : new FormControl("img"),
      CreateAT : new FormControl("createAT"),
      updateAT: new FormControl(Date.now())
    })


  }

  showEdit(id: number) {
    this.id = id
    this.postService.findById(this.id).subscribe((data) => {
      this.yoursPost = data
      this.editForm = new FormGroup({
        id: new FormControl(data.id),
        user: new FormGroup({
          id: new FormControl(data.user.id)
        }),
        content: new FormControl(data.content),
        img: new FormControl(data.img),
        posts: new FormControl(data.posts)
      })
    })
  }


  post() {
    console.log(this.postForm.value)
    alert("Post Was add")

    this.postService.save(this.postForm.value).subscribe(() => {
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
