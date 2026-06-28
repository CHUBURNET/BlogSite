import React, {useState} from "react";
import style from "../../../styles/modules/Post/Comments.module.css"
import sendIcon from "../../../assets/sendIcon.svg";
import {axiosInstance} from "../../../utils/api.ts";
import type {IComment} from "../../../types/postType.ts";
import Author from "../../UI/Author.tsx";

interface IComments {
    postId: number;
    comments: IComment[]
}

const Comments: React.FC<IComments> = ({postId, comments}) => {
    const [comment, setComment] = useState<string>("")

    async function sendComment(e: any): Promise<void> {
        e.preventDefault();
        try {
            const {data} = await axiosInstance.post(`/post/${postId}/comment`, {
                content: comment,
            })
            console.log(data);
        } catch (e) {
            console.log(e)
        }
    }

    console.log(comments);

    return (
        <div className={style.commentsMainContainer}>
            <form onSubmit={sendComment} className={style.form}>
                <input
                    className={style.input}
                    type="text"
                    onChange={(e) => {
                        setComment(e.target.value);
                    }}
                />
                <button className={style.sendBtn}>
                    <img src={sendIcon} alt="send"/>
                </button>
            </form>
            <div>
                {comments.map(({content, author_username, id}: IComment) =>
                    <div className={style.commentContainer} key={id}>
                        <Author
                            author={author_username}
                            scale={0.7}
                        />
                        {/*<div className={style.commentHeader}>*/}
                        {/*    <img className={style.avatar} src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${author_username}`} alt=""/>*/}
                        {/*    <p>{author_username}</p>*/}
                        {/*</div>*/}
                        <div className={style.text}>{content}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comments;