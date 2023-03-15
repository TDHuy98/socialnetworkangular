import {User} from "./User";
import {PostStatus} from "./PostStatus";

export class Post{
  id:number;
  userId:number;
  firstname:string;
  lastname:string;
  content:string;
  postStatus:PostStatus;
  img:string;
  posts:Post[];

}
