import {User} from "./User";
import {FollowerType} from "./FollowerType";

export class Follower{
  id!:number;
  user1!:User;
  user2!:User;
  followerType!:FollowerType;
  createAT!:Date;
  updateAT!:Date;
}
