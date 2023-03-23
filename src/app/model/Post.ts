import {User} from "./User";
import {PostStatus} from "./PostStatus";

export class Post{
  id:number;
  userId:number;
  firstName:string;
  lastName:string;
  content:string;
  postStatus:PostStatus;
  img:string;
  posts:Post[];

}
