import React from 'react';
import style from "../../../styles/pages/AuthPage.module.css";
import FormController from "../../UI/FormController.tsx";
import Button from "../../UI/Button.tsx";
import {axiosInstance} from "../../../utils/api.ts";
import {setUser} from "../../../redux/slices/userSlice.ts";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useForm} from "react-hook-form";

interface IUser {
    username: string;
    email: string;
    password: string;
    password2?: string;
}

interface IAuthForm {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    action: boolean;
    isLoading: boolean;
}

const AuthForm: React.FC<IAuthForm> = ({setIsLoading, isLoading, setError, action}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<IUser>({
        mode: "onChange",
        defaultValues: {
            username: "",
            email: "",
            password: "",
            password2: "",
        }
    });


    const password = watch("password");

    async function onSubmit(data: IUser) {
        setIsLoading(true)
        setError("");

        try {
            if (action) {
                const res = await axiosInstance.post("/user/login/", {
                    email: data.email,
                    password: data.password,
                    identifier: data.username,
                });

                dispatch(setUser(res.data.data.user));
                localStorage.setItem("refreshToken", res.data.data.refreshToken);
                localStorage.setItem("accessToken", res.data.data.accessToken);

                navigate("/");
            } else {
                const res = await axiosInstance.post("/user/register/", data);

                localStorage.setItem("refreshToken", res.data.data.refreshToken);
                localStorage.setItem("accessToken", res.data.data.accessToken);

                navigate("/me");
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    setError("Неверный логин или пароль!");
                    return;
                }
            }
            setError("Неизвестная ошибка");
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={style.inputs}>
                <div>
                    <span className={style.errorMessage}>{errors.username?.message !== "Введите имя пользователя" && errors.username?.message}</span>
                    <FormController
                        name={"username"}
                        control={control}
                        placeholder={action ? "Имя пользователя или Email" : "Имя пользователя"}
                        error={!!errors.username}
                        formType={"text"}
                        rules={{
                            required: "Введите имя пользователя",
                            minLength: {
                                value: 3,
                                message: "Минимум 3 символа"
                            },
                            validate: (value) => {
                                if (!value) return "Введите имя пользователя";

                                const usernameRegex = /^[a-zA-Z0-9_]+$/;
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                                return (
                                    usernameRegex.test(value) ||
                                    emailRegex.test(value) ||
                                    "Введите корректное имя пользователя или email"
                                );
                            }
                        }}
                    />
                </div>
                {!action && (
                    <div>
                        <span className={style.errorMessage}>{errors.email?.message !== "Введите email" && errors.email?.message}</span>
                        <FormController
                            name={"email"}
                            control={control}
                            placeholder={"Введите email"}
                            formType={"email"}
                            rules={{
                                required: "Введите email",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Некорректный email"
                                }
                            }}
                        />
                    </div>
                )}
                <div>
                    <span className={style.errorMessage}>{errors.password?.message !== "Введите пароль" && errors.password?.message}</span>
                    <FormController
                        name={"password"}
                        control={control}
                        placeholder="Пароль"
                        formType={"password"}
                        rules={{
                            required: "Введите пароль",
                            minLength: {
                                value: 8,
                                message: "Минимум 8 символов"
                            },
                            pattern: {
                                value: /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d)[^\s]+$/u,
                                message: "Минимум 1 заглавная, 1 строчная буква и 1 цифра"
                            }

                        }}
                    />
                </div>

                <div>
                    <span className={style.errorMessage}>{errors.password2?.message !== "Повторите пароль" && errors.password2?.message}</span>
                    {!action && (
                        <FormController
                            name={"password2"}
                            control={control}
                            placeholder="Повторите пароль"
                            formType={"password"}
                            rules={{
                                required: "Повторите пароль",
                                validate: (value) =>
                                    value === password || "Пароли не совпадают"
                            }}
                        />
                    )}
                </div>
            </div>

            <Button
                disabled={isLoading}
                formType="submit"
                text={action ? "Войти" : "Зарегистрироваться"}
                style={{ width: '100%', marginTop: '10px' }}
                height="40px"
                color="blue"
            />
        </form>
    );
};

export default AuthForm;