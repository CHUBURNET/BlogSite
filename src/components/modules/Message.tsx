import React from 'react';
import {CustomCarousel as CustomSlider} from "./CustomSlider.tsx";
import style from "../../styles/modules/Message.module.css"
import Line from "../UI/Line.tsx";

interface Props {
    images: string[];
    text: string;
    likes: number;
    dislikes: number;
    isLiked: boolean;
    isDisliked: boolean;
    onReaction?: void;
}

const Message: React.FC<Props> = ({images, text, likes, dislikes, isLiked = false, isDisliked = false, onReaction = (type: string): void => {console.log(type)}}) => {
    return (
        <div
            className={style.MessageContainer}
        >
            <CustomSlider>
                {images.map((image: string) =>
                    <img src={image} alt=""/>
                )}
            </CustomSlider>
            <div className={style.MessageText}>
                <h2>{text}</h2>
            </div>
            <div className={style.MessageReactionsContainer}>
                <div
                    style={{
                        background: isLiked ? "var(--brand-color)" : "var(--page-background)",
                        color: isLiked ? "var(--main-color)" : "var(--text-color)",
                        padding: "5px",
                        borderBottomLeftRadius: "25px",
                        borderTopLeftRadius: "25px",
                        width: "100%",
                    }}
                >
                    <button onClick={() => onReaction("like")}>
                        <span>👍</span>
                        <span>{likes}</span>
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
                        background: isDisliked ? "var(--brand-color)" : "var(--page-background)",
                        color: isDisliked ? "var(--main-color)" : "var(--text-color)",
                        padding: "5px",
                        borderBottomRightRadius: "25px",
                        borderTopRightRadius: "25px",
                        width: "100%",
                    }}
                >
                    <button onClick={() => onReaction("dislike")}>
                        <span>{dislikes}</span>
                        <span>👎</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Message;