import {Component, ElementRef, OnChanges, OnInit} from '@angular/core';
import {PostService} from "../service/post.service";
import {Post} from "../model/model/Post";
import {ImgPost} from "../model/model/ImgPost";
import {ImgService} from '../service/img.service';
import {CmtService} from "../service/cmt.service";
import {Comment} from "../model/model/Comment";
import {data} from 'jquery';
import {FormControl, FormGroup} from "@angular/forms";
import {Element} from "@angular/compiler";

@Component({
  selector: 'app-show-post',
  templateUrl: './show-post.component.html',
  styleUrls: ['./show-post.component.css']
})
export class ShowPostComponent implements OnChanges, OnInit {

  formEdit: FormGroup = new FormGroup({
    // id: new FormControl(0),
    // title: new FormControl(""),
    contentEdit: new FormControl(""),
    // idUser: new FormControl(""),
    nameEdit: new FormControl(""),
  })
  posts: Post[] = [];
  imgs: ImgPost[] = [];
  cmts: Comment[] = [];

  ngOnChanges(): void {

  }

  ngOnInit(): void {


    this.postService.getAll().subscribe(
      (data) => {
        console.log(data);
        this.posts = data;
        this.cmtService.getAllCmt().subscribe(
          (data) => {
            console.log(data);
            this.cmts = data;
          }
        )
        this.imgService.getAllImg().subscribe(
          (data) => {
            console.log(data);
            this.imgs = data;


          }
        )

      }
    )

    console.log(this.imgs);
  }

  delete(id: number) {
    this.cmtService.deleteAllByPost(id).subscribe(data => {
      this.imgService.deleteAllByPost(id).subscribe(data => {
        this.postService.delete(id).subscribe(data => {
          window.location.reload()
        })
      })
    })
  }

  edit() {
  }

  showEdit(id: number) {
    this.formEdit.controls['contentEdit'].setValue( $('#txtContent').text());
    this.formEdit.controls['nameEdit'].setValue( $('#txtImgPost').attr('src'))
  }

  constructor(private postService: PostService, private imgService: ImgService, private cmtService: CmtService) {
  }
}
