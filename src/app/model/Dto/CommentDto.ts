export class CommentDto{
 private _id :number;
 private _userId :number;
 private _content :string;
 private _postId :number;
 private _profile :string;
  private _firstName  :string;
  private _middleName :string;
  private _lastName   :string;


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }

  get content(): string {
    return this._content;
  }

  set content(value: string) {
    this._content = value;
  }

  get postId(): number {
    return this._postId;
  }

  set postId(value: number) {
    this._postId = value;
  }

  get profile(): string {
    return this._profile;
  }

  set profile(value: string) {
    this._profile = value;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get middleName(): string {
    return this._middleName;
  }

  set middleName(value: string) {
    this._middleName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  constructor(id: number, userId: number, content: string, postId: number, profile: string, firstName: string, middleName: string, lastName: string) {
    this._id = id;
    this._userId = userId;
    this._content = content;
    this._postId = postId;
    this._profile = profile;
    this._firstName = firstName;
    this._middleName = middleName;
    this._lastName = lastName;
  }
}
