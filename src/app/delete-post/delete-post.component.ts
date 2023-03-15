import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PostService} from "../service/PostService";

@Component({
  selector: 'app-delete-post',
  templateUrl: './delete-post.component.html',
  styleUrls: ['./delete-post.component.css']
})
export class DeletePostComponent implements OnInit{
id: any;
post: any;



constructor(private route: ActivatedRoute, private postService: PostService, private router: Router) {
}
  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      this.postService.findById(this.id).subscribe((data) => {
        this.post = data
        console.log(data)
      })
    })
  }



}
