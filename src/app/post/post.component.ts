import {Component, OnInit} from '@angular/core';
import {PostService} from "../service/PostService";
import {Post} from "../model/Post";
import {UserService} from "../service/UserService";
import {User} from "../model/User";
import {Router} from "@angular/router";
import {FormControl, FormControlName, FormGroup} from "@angular/forms";


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{
  constructor(private postService: PostService,private router: Router, private userService: UserService) {
  }
  listPosts:Post[] = [];
  users: User[] | undefined;
  formSearch!: FormGroup

  ngOnInit(): void {

    // this.postService.getAll().subscribe((data)=>{
    //   console.log(data)
    //
    //   this.listPosts = data
    //
    // })


    this.formSearch=new FormGroup({
      firstName: new FormControl("firstName")
    })

 }



 searchByName(){
    this.userService.findByUserName(this.formSearch.value).subscribe((data)=>{
      this.users=data
    },error =>{
      alert("not found !")
    })
 }



 // search(){
 //
 //   this.name = document.getElementById("searchName")
 //   this.userService.findByUserName(this.name).subscribe(data => {
 //     this.users= data
 //   }, error => {
 //     alert("sai roi")
 //   } )
 //
 // }


  // delete(id: number) {
  //   alert("Delete Success")
  //   this.postService.delete(id)
  //   this.router.navigate(["/feed"])
  // }



}
