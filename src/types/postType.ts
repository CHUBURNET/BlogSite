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
}

export interface INewPost {
    text: string;
    images: FileList | null;
}

export interface IPostRender extends Omit<IPost, 'images'> {
    images: string[];
}

export interface IGalleryItem {
    author_id: string;
    author_username: string;
    created_at: string;
    image_url: string;
    post_id: number;
    post_text: string;

}