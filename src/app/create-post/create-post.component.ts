import {Component, OnInit} from '@angular/core';
import {Post} from "../model/model/Post";
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {PostService} from "../service/post.service";
import {HttpClient} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {User} from "../model/model/User";
import {ImgPost} from "../model/model/ImgPost";
import {ImgService} from "../service/img.service";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
  providers: [DatePipe]
})
export class CreatePostComponent implements OnInit {
  formCreate!: FormGroup;
  posts: Post[] = [];
  imgs: ImgPost[] = [];
  newDate: string | null = new Date().toString();
  // @ts-ignore
  myDate = this.newDate.toString()

  constructor(private postService: PostService, private router: Router, private http: HttpClient, private datePipe: DatePipe, private imgService: ImgService) {
    this.newDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
  }


  ngOnInit(): void {
    this.formCreate = new FormGroup({
      // id: new FormControl(0),
      // title: new FormControl(""),
      content: new FormControl(""),
      // idUser: new FormControl(""),
      name: new FormControl(""),
    })
  }


  create() {

    const post= {
      // title: "test",
      content: this.formCreate.controls["content"].value,
      postTime: this.myDate,
      user: {
        "id": 2
      },
    };

    // console.log(this.posts)

    this.postService.create(post).subscribe((data) => {
      console.log(data)
        this.addimg(data);
        //
        this.formCreate.reset();
      },

    );

    }
  addimg(data:Post) {
    alert(data.content)
    let img = {
      post: {id: data.id},
      name: this.formCreate.controls['name'].value,
    };
    this.imgService.create(img).subscribe(
      data => {
        alert(this.formCreate.controls['name']);
        this.formCreate.reset();
      },
      (error) => {
        console.error(error);
        alert('Failed to add img!');
      }
    );
    window.location.reload();
  }


  binddata() {
    // alert(this.formCreate.controls["name1"].value)
    alert(this.formCreate.get("name1")?.value)
    alert(this.formCreate.controls['name1']?.value)
    alert(this.formCreate.get('name1')?.value)

  }

// addImg(){
//   this.imgCreat.name=  "data:image/jbsAtL1O9nl5LlpXMBtt"
//   this.imgCreat.id=  null;
//   this.imgCreat2.name="daa:image/sdfgsdfgsfgfdgsdfgdfgsdfgdfg"
//   this.imgCreat2.id= null
//   this.listImg.push(this.imgCreat)
//   this.listImg.push(this.imgCreat2)
//   this.post.imgPosts.push(this.imgCreat)
//   this.post.imgPosts.push(this.imgCreat2)
// }

  findAll() {
    this.http.get<Post[]>('http://localhost:8080/post').subscribe(data => {
      this.posts = data;
    }, error => {

    })
  }

  findAllImg() {
    this.http.get<ImgPost[]>('http://localhost:8080/images').subscribe(data => {
      this.imgs = data;
    }, error => {

    })
  }

  createWithW(post
                :
                Post
  ) {
    this.postService.create(this.formCreate.value).subscribe(() => {
      alert("create thành công");
      this.findAll();
    })

  }

  create2() {
    this.postService.create(this.formCreate.value).subscribe(() => {
      alert("create thành công");
      this.findAll();
    })

  }

// showEdit(post: Post) {
//   this.findById(post.id).subscribe((data) => {
//     this.product = data;
//   })
// }

  edit(formEdit
         :
         any
  ) {
    this.postService.edit(formEdit).subscribe(() => {
      alert("edit thành công");
      this.findAll();

    })
  }

  delete(id
           :
           number
  ) {
    this.postService.delete(id).subscribe(() => {
      alert("xóa thành công");
      this.findAll();
    })

  }


}
