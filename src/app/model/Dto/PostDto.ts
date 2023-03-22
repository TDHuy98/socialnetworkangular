import {PostStatus} from "../PostStatus";

export class PostDto{
  id:number;
  userId: number;
  firstName: string;
  middleName:string;
  lastName:string;
  content:string;
  postStatus: PostStatus;
  img:string
  postId:number
  profile:string

}
