import React, {useEffect, useState} from 'react';
import style from "../../styles/pages/ProfilePage.module.css"
import UserProfile from "../modules/Profile/UserProfile.tsx";
import UserPosts from "../modules/Profile/UserPosts.tsx";
import type {IUser, IUserState} from "../../types/userType.ts";
import {Link, useParams} from "react-router-dom";
import Button from "../UI/Button.tsx";
import {axiosInstance} from "../../utils/api.ts";
import {useSelector} from "react-redux";
import type {RootState} from "../../redux/store.ts";

const ProfilePage: React.FC<IUserState> = ({user}) => {
    const userRedux:IUser = useSelector((state: RootState) => state.user);
    const {username} = useParams()
    const [userState, setUserState] = useState<IUser | undefined>(user)

    async function getUser(): Promise<void> {
        try {
            const {data} = await axiosInstance.get(`/user/username/${username}`);
            setUserState(data.data)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (!user) {
            getUser()
        } else {
            setUserState(user)
        }
    }, [user, userRedux]);

    return (
        <div className={style.Page}>
            <UserProfile
                user={userState || userRedux}
                getUser={getUser}
            />
            <div style={{
                marginTop: "40px",
                padding: "5px"
            }}>
                {(userRedux.username === username || userState?.username === userRedux.username) &&
                    <>
                        <Link to={"/publication"}>
                            <Button
                                text={"+"}
                                color={"blue"}
                                width={"100%"}
                                style={{
                                    margin: "10px auto",
                                    fontSize: "24px",
                                }}
                            />
                        </Link>
                    </>

                }
            </div>
            <UserPosts
                userId={userState?.id}
                username={userState?.username}
            />
        </div>
    );
};

export default ProfilePage;