import {Post} from "./Post";
import {User} from "./User";



export class Comment {
  id :number;
  user :User;
  content :string;
  postId :number;


  constructor(id: number, user: User, content: string, postId: number) {
    this.id = id;
    this.user = user;
    this.content = content;
    this.postId = postId;
  }
}
