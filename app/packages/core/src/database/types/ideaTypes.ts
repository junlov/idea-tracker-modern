export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  numIdeasSubmitted?: number;
  numCommentsLeft?: number;
  signUpDate: Date;
  lastLoginDate: Date;
  numLogins: number;
  hubspotContactId?: string;
  rank?: string;
  // propertyHistory?: IUserHistory;
}

export interface IUserHistory {}

export interface IIdeas {}

export interface IFactions {}

export interface IAccounts {}
