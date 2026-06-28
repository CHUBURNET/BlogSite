import React from 'react';
import style from "../../styles/UI/Author.module.css";

interface IAuthor {
    author: string | undefined;
    scale?: number;
}

const Author: React.FC<IAuthor> = ({author, scale=1}) => {
    return (
        <div className={style.authorSection}>
            <img
                style={{
                    width: `${50 * scale}px`,
                    height: `${50 * scale}px`,
                    borderRadius: `50%`,
                }}
                src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${author}`}
                alt={`${author}`}
            />
            <span>{author}</span>
        </div>
    );
};

export default Author;