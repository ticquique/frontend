export interface IToken {
    sub: string;
    privileges: string;
    role: string;
    iat: number;
    exp: number;
}

export type IEncriptedToken = string;
