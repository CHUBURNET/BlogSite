import React, {useState} from 'react';
import style from "../../../styles/modules/Post/PostContent.module.css"
import type {IComment, IHashtags} from "../../../types/postType.ts";
import {CustomCarousel as CustomSlider} from "./CustomSlider.tsx";
import commentIcon from "../../../assets/commentIcon.svg"
import Comments from "./Comments.tsx";
import Reaction from "./Reaction.tsx";
import Author from "../../UI/Author.tsx";

interface Props {
    getPosts: () => Promise<void>;
    isDisliked: boolean;
    isLiked: boolean;
    dislikes: string;
    likes: string;
    text: string;
    author?: string;
    images: string[];
    id: number;
    hashtags: IHashtags[];
    // setHashtag: React.Dispatch<React.SetStateAction<string>>;
    comments_count: number;
    comments: IComment[];
}

const PostContent: React.FC<Props> = ({comments, comments_count, hashtags, id, images, author, text, likes, dislikes, isLiked = false, isDisliked = false, getPosts}) => {
    const [isOpenComments, setIsOpenComments] = useState(false)

    return (
        <div className={style.MessageContainer}>
            <Author author={author}/>
            {(images.length > 1 && images.length > 0) ?
                <CustomSlider>
                    {images.map((image: string) =>
                        <img src={image} alt=""/>
                    )}
                </CustomSlider>
                :
                <img src={images[0]} alt=""/>
            }

            <div className={style.MessageText}>
                <h2>{text}</h2>
            </div>
            <div className={style.MessageText}>
                <p className={style.hashtags}>
                    {hashtags.map((hashtag: IHashtags) =>
                        <span key={hashtag.id}>{hashtag.name}</span>
                    )}
                </p>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                <Reaction
                    isLiked={isLiked}
                    isDisliked={isDisliked}
                    likes={likes}
                    dislikes={dislikes}
                    getPosts={getPosts}
                    id={id}
                />
                <div className={style.commentBtnContainer}>
                    <button>
                        <img
                            onClick={() => setIsOpenComments(!isOpenComments)}
                            src={commentIcon}
                            alt="comments"
                        />
                    </button>
                    <span>({comments_count})</span>
                </div>
            </div>

            {isOpenComments &&
                <Comments
                    postId={id}
                    comments={comments}
                />
            }
        </div>
    );
};

export default PostContent;