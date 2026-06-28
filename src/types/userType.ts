export interface IUser {
    id?: number;
    email: string;
    username: string;
    isAdmin: boolean;
    createdAt?: string;
    following_count: string;
    post_count: string;
    following: IFollowing[];
}

export interface IFollowing {
    id: number;
    username: string;
}

export interface IUserState {
    user?: IUser;
    getUser?: () => Promise<void>
}