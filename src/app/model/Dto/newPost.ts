import {User} from "../User";
import {PostStatus} from "../PostStatus";
import {Post} from "../Post";

export class NewPost {
  content!: string;
  postStatus: PostStatus;
  img: string;
  // posts: Post[];
}
