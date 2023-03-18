import {PostStatus} from "../PostStatus";

export class PostDto{
  id:number;
  userId: number;
  firstname: string;
  middlename:string;
  lastname:string;
  content:string;
  postStatus: PostStatus;
  img:string
  postId:number
  profile:string
}
