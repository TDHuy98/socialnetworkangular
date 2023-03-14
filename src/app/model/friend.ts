import {User} from "./User";

export class Friend{
  id !: number;
  source !: User;
  target !: User;
  relationshipType !: string;
  friendshipStatus !: string;
}
