import React, {useEffect, useState} from 'react';
import type {IUser} from "../../types/userType.ts";
import {useDispatch, useSelector} from "react-redux";
import style from "../../styles/pages/ProfilePage.module.css"
import Button from "../UI/Button.tsx";
import {axiosInstance} from "../../utils/api.ts";
import {useNavigate} from "react-router-dom";
import {clearUser, setUser} from "../../redux/slices/userSlice.ts";
import type {RootState} from "../../redux/store.ts";
import axios from "axios";
import {Controller, useForm} from "react-hook-form";
import Input from "../UI/Input.tsx";
import FormInput from "../UI/FormInput.tsx";

interface INewPassword {
    oldPassword: string,
    newPassword: string
    newPassword2: string
}

interface INewUserData {
    email: string,
    username: string,
}

type LoadingState = "idle" | "changingPassword" | "logout" | "updatingProfile";

const ProfilePage: React.FC = () => {
    const user:IUser = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState<LoadingState>("idle");
    const [passwordError, setPasswordError] = useState<string>("");
    const {
        control: passwordControl,
        handleSubmit: handlePasswordSubmit,
        watch,
        formState: { errors: passwordErrors }
    } = useForm<INewPassword>({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            newPassword2: "",
        }
    });

    const newPassword = watch("newPassword");

    const onChangePassword = async (data: INewPassword) => {
        setPasswordError("");
        setLoading("changingPassword");

        try {
            await axiosInstance.post("user/change-password", data);
        } catch (e) {
            if (axios.isAxiosError<{ message: string }>(e)) {
                if (!e.response) {
                    setPasswordError("Нет соединения с сервером");
                    return;
                }

                setPasswordError(
                    e.response.data?.message || "Ошибка сервера"
                );
            }
        } finally {
            setLoading("idle");
        }
    };

    // =========================
    // 👤 FORM: PROFILE DATA
    // =========================
    const {
        control: profileControl,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors }
    } = useForm<INewUserData>({
        defaultValues: {
            email: user.email,
            username: user.username,
        }
    });

    console.log(profileErrors)

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

    // =========================
    // 🚪 LOGOUT
    // =========================
    async function logout(): Promise<void> {
        setLoading("logout");

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
            setLoading("idle");
        }
    }

    useEffect(() => {
        console.log(passwordErrors);
    }, [passwordErrors]);

    useEffect(() => {
        console.log(profileErrors);
    }, [profileErrors]);

    return (
        <div className={style.page}>

            {/* ================= PROFILE ================= */}
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

            {/* ================= PASSWORD ================= */}
            <div className={style.changePasswordContainer}>
                <h3>Сменить пароль</h3>

                <p className={style.errorMessage}>
                    {loading === "changingPassword"
                        ? "Меняем пароль..."
                        : passwordError}
                </p>

                <form onSubmit={handlePasswordSubmit(onChangePassword)}>
                    <div className={style.changePasswordInputContainer}>

                        <Controller
                            name="oldPassword"
                            control={passwordControl}
                            rules={{ required: "Введите старый пароль" }}
                            render={({ field }) => (
                                <FormInput field={field} formType="password" placeholder="Старый пароль"/>
                            )}
                        />

                        <Controller
                            name="newPassword"
                            control={passwordControl}
                            rules={{
                                required: "Введите пароль",
                                minLength: {
                                    value: 8,
                                    message: "Минимум 8 символов"
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!"№;%:?*()_+@#$^&\-=&]+$/,
                                    message: "Пароль должен содержать: A-Z, a-z, цифру"
                                }
                            }}
                            render={({ field }) => (
                                <FormInput field={field} formType="password" placeholder="Новый пароль"/>
                            )}
                        />

                        <Controller
                            name="newPassword2"
                            control={passwordControl}
                            rules={{
                                validate: (value) =>
                                    value === newPassword || "Пароли не совпадают"
                            }}
                            render={({ field }) => (
                                <FormInput field={field} formType="password" placeholder="Повторите пароль"/>
                            )}
                        />

                        <Button
                            formType="submit"
                            disabled={loading !== "idle"}
                            text={"Подтвердить"}
                            width={"100%"}
                            color={"blue"}
                        />
                    </div>
                </form>
            </div>

            {/* ================= LOGOUT ================= */}
            <div className={style.logoutContainer}>
                <p className={style.loadingMessage}>
                    {loading === "logout" && "Выполняется выход..."}
                </p>

                <Button
                    disabled={loading !== "idle"}
                    onClick={logout}
                    text={"Выйти"}
                    style={{
                        background: "red",
                        width: "100%",
                    }}
                />
            </div>
        </div>
    );
};

export default ProfilePage;
