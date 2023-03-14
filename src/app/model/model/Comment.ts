import { User } from "./User";
import {Post} from "./Post";


export class Comment {
  id!: number;
  content!: string;
  user!: User;
  post!: Post;


  constructor(id: number, content: string, user: User, post: Post) {
    this.id = id;
    this.content = content;
    this.user = user;
    this.post = post;
  }
}
