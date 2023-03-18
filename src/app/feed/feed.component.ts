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
import * as stream from "stream";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  currentLoggedInUserId = Number(localStorage.getItem('userId'))
  postForm: FormGroup[] | any;
  editForm: FormGroup | any;
  yoursPost: Post | undefined;
  posts: Post[] | undefined;
  selectedImage: any = null;
  @ViewChild('uploadFile', {static: true}) public avatarDom: ElementRef | undefined;
  ArrayPicture = "";
  editPost: Post | any;

  newPost: NewPost | any;

  constructor(private postService: PostService, private router: Router, private route: ActivatedRoute, @Inject(AngularFireStorage) private storage: AngularFireStorage) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.newPost = {
      userId: this.currentLoggedInUserId,
      content: '',
      postStatus: PostStatus.Public,
      img: '',
      posts: new FormControl(""),
    }

    this.editPost = {
      id: '',
      userId: this.currentLoggedInUserId,
      postStatus: '',
      content: '',
      img: '',
    }


    this.postService.findAllByUser_Id(this.currentLoggedInUserId).subscribe(data => {
      this.posts = data
    }, error => {
      alert("false")
    })


  }


  ngOnInit() {


    this.postForm = new FormGroup({
      userId: new FormControl(this.currentLoggedInUserId),
      content: new FormControl("content"),
      postStatus: new FormControl("postStatus", Validators.required),
      img: new FormControl(""),
      posts: new FormControl(""),
    })


    this.editForm = new FormGroup({
      userId: new FormControl(""),
      postId: new FormControl("id"),
      postStatus: new FormControl("postStatus"),
      content: new FormControl("content"),
      img: new FormControl("img"),
    })


  }


  showEdit(idPost: number) {
    this.postService.findById(idPost).subscribe((data) => {
      console.log(data)
      alert("open modal")
      this.editForm = new FormGroup({
        postId: new FormControl(data?.postId),
        content: new FormControl(data?.content),
        img: new FormControl(data?.img),
        postStatus: new FormControl(data?.postStatus)
      })
    })
  }


  creatPost() {

    if (this.selectedImage != null) {
      const filePath = this.selectedImage.name;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => (fileRef.getDownloadURL().subscribe(url => {
          console.log(url)
          this.newPost.userId = this.currentLoggedInUserId;
          this.newPost.content = this.postForm.get("content").value;
          this.newPost.postStatus = this.postForm.get("postStatus").value;
          this.newPost.img = url;
          this.postService.save(this.newPost).subscribe(() => {
            alert("create post success")
            this.router.navigateByUrl('/feed')
            window.location.reload()
          }, error => {
            alert("error")
          })
        })))
      ).subscribe()
      this.selectedImage = null;
    } else {
      this.newPost.userId = this.currentLoggedInUserId;
      this.newPost.content = this.postForm.get("content").value;
      this.newPost.postStatus = this.postForm.get("postStatus").value;
      this.postService.save(this.newPost).subscribe(() => {
        alert("create post success")
        this.router.navigateByUrl('/feed')
      }, error => {
        alert("error")
      })
      this.selectedImage = null;
    }
  }

  showFile() {
    const filePath = this.selectedImage.name;
    const fileRef = this.storage.ref(filePath);
    this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
      finalize(() => (fileRef.getDownloadURL().subscribe(url => {
        console.log(url)
        this.ArrayPicture = url;
      })))
    )
  }

  uploadFile2() {
    this.selectedImage = this.avatarDom?.nativeElement.files[0];
  }

  edit() {
    console.log(this.editForm.value);
    if (this.selectedImage != null) {
      const filePath = this.selectedImage.name;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => (fileRef.getDownloadURL().subscribe(url => {
          this.ArrayPicture = url;
          console.log(url)

          this.postService.edit(this.editPost).subscribe(() => {
            alert("success")

            this.router.navigateByUrl("/feed");
            window.location.reload();
          }, error => {
            alert("lỗi ảnh")
          })
        })))
      ).subscribe()
    } else {
      this.editPost.id = this.editForm.get('postId').value;
      this.editPost.userId = this.currentLoggedInUserId;
      this.editPost.content = this.editForm.get('content').value;
      this.editPost.postStatus = this.editForm.get('postStatus').value;
      console.log(this.editPost)

      this.postService.edit(this.editPost).subscribe(() => {
        alert("edit success");
        this.router.navigateByUrl('/feed');
        window.location.reload();
      }, error => {
        alert("lỗi dữ liệu đầu vào")
      })
    }

    this.selectedImage = null;
  }


  delete(id: number) {
    this.postService.delete(id).subscribe(() => {
      alert("delete succes")
      this.router.navigate(["/feed"])
    }, error => {
      alert("delete false")
    })

  }

  getCurrentDateTime(): string {
    return formatDate(new Date(), 'dd-MM-yyyyhhmmssa', 'en-US');
  }
}
