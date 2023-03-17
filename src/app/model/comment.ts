import {Post} from "./Post";

export class Comment{
  id!:number;
  UserId!: number;
  content!:string;
  post!: Post;
  comment! : Comment[];

}
