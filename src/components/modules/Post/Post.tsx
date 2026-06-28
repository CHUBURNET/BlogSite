import React, {useState} from 'react';
import type {IComment, IHashtags} from "../../../types/postType.ts";
import PostActions from "./PostActions.tsx";
import PostContent from "./PostContent.tsx";
import PostEditor from "./PostEditor.tsx";

interface Props {
    username: string;
    comments: IComment[];
    comments_count: number;
    hashtags: IHashtags[];
    isAdmin?: boolean;
    id: number;
    images: string[];
    author?: string;
    text: string;
    likes: string;
    dislikes: string;
    isLiked: boolean;
    isDisliked: boolean;
    getPosts: () => Promise<void>;
}
// isAdmin=false,
const Post: React.FC<Props> = ({username, comments, comments_count, hashtags, id, images, author, text, likes, dislikes, isLiked = false, isDisliked = false, getPosts}) => {

    const [isEditMode, setIsEditMode] = useState<boolean>(false)

    return (
        <div style={{position: 'relative', zIndex: 1}}>
            {(author === username) &&
                <PostActions
                    postId={id}
                    getPosts={getPosts}
                    isEditMode={isEditMode}
                    setIsEditMode={setIsEditMode}
                />
            }
            {isEditMode ?
                <PostEditor
                    text={text}
                    author={author}
                    hashtags={hashtags}
                    getPosts={getPosts}
                    isEditMode={isEditMode}
                    setIsEditMode={setIsEditMode}
                    id={id}

                />
                :
                <PostContent
                    getPosts={getPosts}
                    isDisliked={isDisliked}
                    isLiked={isLiked}
                    dislikes={dislikes}
                    likes={likes}
                    text={text}
                    author={author}
                    images={images}
                    id={id}
                    hashtags={hashtags}
                    comments_count={comments_count}
                    comments={comments}
                />
            }
        </div>


    );
};

export default Post;