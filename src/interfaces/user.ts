export interface IUser {
  id?: string;
  role?: 'artist' | 'editor';
  email?: string;
  username?: string;
  password?: string;
  posts?: string[];
  privacy?: 'public' | 'semirestricted' | 'restricted' | 'private';
  reaction?: string;
  numComments?: number;
  privileges?: 'Member' | 'Client' | 'Owner' | 'Admin';
  profile?: {
    picture?: {
      small?: string,
      medium?: string,
      big?: string,
      low?: string,
      orig: string,
    },
    profilePicture?: {
      small?: string,
      medium?: string,
      big?: string,
      low?: string,
      orig: string,
    },
    city?: string,
    country?: string,
    birth_date?: Date,
    gender?: 'Male' | 'Female' | 'Undefined' | 'Other',
    phone?: string,
    hobbies?: string,
    website?: string,
    facebook?: string,
    twitter?: string,
    google?: string,
    stripe?: string
  };
  points?: {
    numLikes?: number,
    numComments?: number,
    firstReg?: number
  };
  createdAt?: Date;
  updatedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}
