export interface IUser {
    username: string;
    email: string;
    id?: number;
    isAdmin: boolean;
    createdAt?: Date;
}

export interface IUserState {
    user: IUser;
}