import React from 'react';
import style from "../../../styles/modules/ProfileSettings/ProfileInfo.module.css";
import {Controller, useForm} from "react-hook-form";
import Input from "../../UI/Input.tsx";
import Button from "../../UI/Button.tsx";
import {axiosInstance} from "../../../utils/api.ts";
import {setUser} from "../../../redux/slices/userSlice.ts";
import type {IUser} from "../../../types/userType.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../../redux/store.ts";
import {Link} from "react-router-dom";

type LoadingState = "idle" | "changingPassword" | "logout" | "updatingProfile";

interface IProfileInfo {
    loading: LoadingState;
    setLoading: React.Dispatch<React.SetStateAction<LoadingState>>;
}

interface INewUserData {
    email: string,
    username: string,
}

const ProfileInfo: React.FC<IProfileInfo> = ({setLoading, loading}) => {
    const dispatch = useDispatch();

    const user:IUser = useSelector((state: RootState) => state.user);

    const {
        control: profileControl,
        handleSubmit: handleProfileSubmit,
        // formState: { errors: profileErrors }
    } = useForm<INewUserData>({
        defaultValues: {
            email: user.email,
            username: user.username,
        }
    });

    const onUpdateProfile = async (data: INewUserData) => {
        setLoading("updatingProfile");

        try {
            const response = await axiosInstance.put("/user/", data);
            dispatch(setUser(response.data.data));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading("idle");
        }
    };

    return (
        <>
            <div className={style.Back}>
                <Link to={"/me"}>
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#1573fe" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path><path fill="#1573fe" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path></g></svg>
                </Link>
            </div>
            <div className={style.mainInfo}>
                <div className={style.avatar}>
                    <img src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${user.username}`} alt=""/>
                </div>

                <form onSubmit={handleProfileSubmit(onUpdateProfile)}>
                    <div className={style.textInfo}>
                        <div>
                            <div className={style.inputContainer}>Имя:</div>
                            <div className={style.inputContainer}>Почта:</div>
                        </div>

                        <div>
                            <div className={style.inputContainer}>
                                <Controller
                                    name="username"
                                    control={profileControl}
                                    defaultValue={user.username}
                                    rules={{
                                        required: "Введите username",
                                        minLength: {
                                            value: 3,
                                            message: "Минимум 3 символа"
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z0-9_]+$/,
                                            message: "Только буквы, цифры и _"
                                        }
                                    }}
                                    render={({ field }) => (
                                        <Input {...field} />
                                    )}
                                />
                            </div>

                            <div className={style.inputContainer}>
                                <Controller
                                    name="email"
                                    control={profileControl}
                                    defaultValue={user.email}
                                    rules={{
                                        required: "Введите email",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Некорректный email"
                                        }
                                    }}
                                    render={({ field }) => (
                                        <Input {...field} />
                                    )}
                                />
                            </div>
                        </div>

                    </div>

                    <Button
                        text={"Сохранить"}
                        color={"blue"}
                        width={"100%"}
                        formType="submit"
                        disabled={loading !== "idle"}
                    />
                </form>
            </div>
        </>
    );
};

export default ProfileInfo;