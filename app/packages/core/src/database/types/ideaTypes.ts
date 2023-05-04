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
  propertyHistory?: IUserHistory;
}

export interface IPropertyHistory {
  value: string;
  whenModified: Date;
}
export interface IUserHistory {
  firstNameHistory: IPropertyHistory;
  lastNameHistory: IPropertyHistory;
  rankHistory: IPropertyHistory;
  emailHistory: IPropertyHistory;
}

export interface IIdeas {
  title: string;
  detail: string;
  date: Date;
  author: string | undefined;
}

export interface IFactions {
  domain: string;
  hubspotCompanyId: string;
  name: string;
  members: string;
}

export interface IAccounts {
  accountId: number;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}
