import {User} from "./User";

export class Message{
  id!:number;
  source!:User;
  target!:User;
  message!:string;
  crateAT!:Date;
  updateAT!:Date;
}
