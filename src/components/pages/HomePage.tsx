import React, {useEffect, useRef} from 'react';
import {useSelector} from "react-redux";
import type {RootState} from "../../redux/store.ts";
import type {IUser} from "../../types/userType.ts";
import type { IPostRender} from "../../types/postType.ts";
import Header from "../modules/Header.tsx";
import Post from "../modules/Post/Post.tsx";

interface IHomePage {
    getPosts: () => Promise<void>;
    posts: IPostRender[];
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setHashtag: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
    hasMore: boolean;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const HomePage: React.FC<IHomePage> = ({setQuery, getPosts, posts, setPage, isLoading, hasMore }) => {
    const observerTarget = useRef(null);
    const user: IUser = useSelector((state: RootState) => state.user);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading && hasMore) {
                    setPage((prev) => prev + 1);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px 400px 0px'
            }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [observerTarget, isLoading, hasMore, setPage]);

    return (
        <div className={"Page"}>
            <Header
                setQuery={setQuery}
            />
            <div style={{paddingTop: "50px"}}>
                {posts.map((post: IPostRender) =>
                    <Post
                        // setHashtag={setHashtag}
                        hashtags={post.hashtags}
                        key={post.id}
                        id={post.id}
                        author={post.author_username}
                        images={post.images}
                        text={post.text}
                        likes={post.likes_count}
                        dislikes={post.dislikes_count}
                        isDisliked={post.user_reaction === "dislike"}
                        isLiked={post.user_reaction === "like"}
                        getPosts={getPosts}
                        isAdmin={user.isAdmin}
                        username={user.username}
                        comments_count={post.comments_count}
                        comments={post.comments}
                    />
                )}
            </div>
            <div ref={observerTarget} style={{ height: '50px', display: 'flex', justifyContent: 'center' }}>
                {isLoading && <p>Загрузка...</p>}
                {!hasMore && posts.length > 0 && <p>Это все посты</p>}
            </div>
        </div>
    );
};

export default HomePage;