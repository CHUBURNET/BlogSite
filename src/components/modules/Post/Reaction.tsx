import React, {useState} from 'react';
import style from "../../../styles/modules/Post/Reaction.module.css";
import Line from "../../UI/Line.tsx";
import {axiosInstance} from "../../../utils/api.ts";
import axios from "axios";

interface IReaction {
    likes: string;
    dislikes: string;
    isLiked: boolean;
    isDisliked: boolean;
    getPosts: () => Promise<void>;
    id: number;
}

const Reaction: React.FC<IReaction> = ({isDisliked, isLiked, likes, dislikes, getPosts, id}) => {

    const [dislikeState, setDislikeState] = useState<boolean>(isDisliked);
    const [likeState, setLikeState] = useState<boolean>(isLiked);
    const [likeCount, setLikeCount] = useState<number>(Number(likes));
    const [dislikeCount, setDislikeCount] = useState<number>(Number(dislikes));

    async function sendReaction(id: number, type: string): Promise<void> {
        if (type === "dislike") {
            if (dislikeState) {
                setDislikeState(false);
                setDislikeCount(dislikeCount - 1);
            } else {
                setDislikeState(true);
                setDislikeCount(dislikeCount + 1);

                if (likeState) {
                    setLikeState(false);
                    setLikeCount(likeCount - 1);
                }
            }
        } else if (type === "like") {
            if (likeState) {
                setLikeState(false);
                setLikeCount(likeCount - 1);
            } else {
                setLikeState(true);
                setLikeCount(likeCount + 1);

                if (dislikeState) {
                    setDislikeState(false);
                    setDislikeCount(dislikeCount - 1);
                }
            }
        }

        try {
            await axiosInstance.post("post/reaction", {
                postId: id,
                type: type
            })
            getPosts()
        } catch (e) {
            if (type === "dislike") {
                setDislikeState(false);
                setDislikeCount(dislikeCount - 1);
            } else if (type === "like") {
                setLikeState(false);
                setLikeCount(likeCount - 1);
            }
            if (axios.isAxiosError(e)){
                console.error(e)
            }
        }
    }

    return (
            <div className={style.MessageReactionsContainer}>
                <div
                    style={{
                        textAlign: "left",
                        background: likeState ? "var(--brand-color)" : "var(--page-background)",
                        color: likeState ? "var(--main-color)" : "var(--text-color)",
                        padding: "5px",
                        borderBottomLeftRadius: "25px",
                        borderTopLeftRadius: "25px",
                        width: "100%",
                    }}
                >
                    <button onClick={async () => {
                        await sendReaction(id, "like")
                    }}>
                        <span>👍</span>
                        <span>{likeCount}</span>
                    </button>
                </div>
                <div>
                    <Line
                        style={{
                            marginLeft: "5px",
                        }}
                        width={"1px"}
                        type={"vertical"}
                    />
                </div>
                <div
                    style={{
                        textAlign: "right",
                        background: dislikeState ? "var(--brand-color)" : "var(--page-background)",
                        color: dislikeState ? "var(--main-color)" : "var(--text-color)",
                        padding: "5px",
                        borderBottomRightRadius: "25px",
                        borderTopRightRadius: "25px",
                        width: "100%",
                    }}
                >
                    <button onClick={async () => {
                        await sendReaction(id, "dislike")
                    }}>
                        <span>{dislikeCount}</span>
                        <span>👎</span>
                    </button>
                </div>
            </div>

    );
};

export default Reaction;