import React, {useState} from 'react';
import style from "../../../styles/modules/Profile/UserProfile.module.css"
import type {IUser, IUserState} from "../../../types/userType.ts";
import {Link, useNavigate} from "react-router-dom";
import Button from "../../UI/Button.tsx";
import {axiosInstance} from "../../../utils/api.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../../redux/store.ts";
import Logout from "../ProfileSettings/Logout.tsx";
import {clearUser} from "../../../redux/slices/userSlice.ts";

// interface IUserProfile {
//     user: IUser;
// }

const UserProfile: React.FC<IUserState> = ({user, getUser}) => {
    const userRedux:IUser = useSelector((state: RootState) => state.user);

    const [logOutLoading, setLogOutLoading] = useState(false)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function followUser() {
        try {
            const {data} = await axiosInstance.post(`/user/username/${user?.username}/follow`);
            console.log(data);
            if (getUser) getUser()
        } catch (e) {
            console.log(e)
        }
    }

    async function unFollowUser() {
        try {
            const {data} = await axiosInstance.delete(`/user/username/${user?.username}/follow`);
            console.log(data);
        } catch (e) {
            console.log(e)
        }
    }

    async function logout(): Promise<void> {
        setLogOutLoading(true)
        try {
            await axiosInstance.post("user/logout", {
                refreshToken: localStorage.getItem("refreshToken"),
            });

            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessToken");

            dispatch(clearUser());
            navigate("/auth");

        } catch (e) {
            console.error(e);
        } finally {
            setLogOutLoading(false)
        }
    }

    return (
        <div className={style.Container}>
            <div className={style.Avatar}>
                <img src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${user?.username}`} alt=""/>
            </div>
            <div className={style.profileInfo}>
                <h2>{user?.username}</h2>
                <div className={style.profileNumbers}>
                    <span>{user?.post_count || 0} публикаций</span>
                    <span>{user?.following_count} подписчиков</span>
                    <span>{user?.following?.length} подписок</span>
                </div>
                <div>
                    {userRedux.username !== user?.username ?
                        <>
                        {userRedux.following.find(u => u.username === user?.username) ?
                            <Button
                                width={"100%"}
                                text={"Отписаться"}
                                color="blue"
                                onClick={unFollowUser}
                            />
                            :
                            <Button
                                width={"100%"}
                                text={"Подписаться"}
                                color="blue"
                                onClick={followUser}
                            />
                        }

                        </>
                        :
                        <>
                            {userRedux.username &&
                                <div style={{display: "flex", flexDirection: "column", gap: "7px"}}>
                                    <Link to={`/me/settings`}>
                                        <Button
                                            width={"100%"}
                                            text={"Редактировать"}
                                            color="blue"
                                        />
                                    </Link>
                                    <Button
                                        disabled={logOutLoading}
                                        onClick={logout}
                                        text={"Выйти"}
                                        style={{
                                            background: "red",
                                            width: "100%",
                                        }}
                                    />
                                </div>
                            }
                        </>

                    }
                </div>
            </div>
        </div>
    );
};

export default UserProfile;