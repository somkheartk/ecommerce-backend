export interface IUser {
  _id?: string;
  email: string;
  passwordHash?: string; // optional, do not return in API
  name: string;
  role: string;
  createdAt: Date;
}
