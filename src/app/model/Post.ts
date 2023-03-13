import {User} from "./User";
import {PostStatus} from "./PostStatus";

export class Post{
  id!:number;
  user!:User;
  content!:string;
  postStatus!:PostStatus;
  img!:string;
  posts!:Post[];
  createAT! : Date;
  updateAT!: Date;
}
