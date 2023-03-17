import {PostStatus} from "../PostStatus";

export class PostDto{
  id!:number;
  userId!: number;
  firstname!: string;
  lastname!:string;
  content!:string;
  postStatus!: PostStatus;
  img:string
  postId:number
}