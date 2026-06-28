export interface IPost {
    author_id: number;
    author_username: string;
    created_at: string;
    dislikes_count: string;
    id: number
    images: FileList | null;
    likes_count: string;
    text:string;
    updated_at: string;
    user_reaction: string | null;
    hashtags: IHashtags[];
}

export interface INewPost {
    text: string;
    images: FileList | null;
    hashtags: string[];
}

export interface IEditPost {
    text: string;
    images: FileList | null;
    hashtags: IComment[];
}

export interface IPostRender extends Omit<IPost, 'images'> {
    images: string[];
    comments_count: number;
    comments: IComment[];
}

export interface IGalleryItem {
    author_id: string;
    author_username: string;
    created_at: string;
    image_url: string;
    post_id: number;
    post_text: string;

}

export interface IComment {
    id: number;
    post_id: number;
    content: string;
    author_id: number;
    author_username: string;
    created_at: string;
    updated_at: string;

}

export interface IHashtags {
    id: number;
    name: string;
}