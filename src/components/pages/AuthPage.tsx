import React, {useState} from 'react';
import style from "../../styles/pages/AuthPage.module.css";
import Button from "../UI/Button.tsx";
import {axiosInstance} from "../../utils/api.ts";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setUser} from "../../redux/slices/userSlice.ts";
import axios from "axios";
import {Controller, useForm} from "react-hook-form";
import FormInput from "../UI/FormInput.tsx";

interface IUser {
    username: string;
    email: string;
    password: string;
    password2?: string;
}

const AuthPage: React.FC = () => {
    const [action, setAction] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

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

    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        <div className="Page">
            <div className={style.container}>
                <div className={style.content}>
                    <h2>{action ? "Вход" : "Регистрация"}</h2>
                    {isLoading ?
                        <p className={style.loadingMessage}>{action ? "Входим..." : "Регистрируем..."}</p>
                        :
                        <p className={style.errorMessage}>{error}</p>
                    }


                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={style.inputs}>
                            <div>
                                <span className={style.errorMessage}>{errors.username?.message !== "Введите имя пользователя" && errors.username?.message}</span>
                                <Controller
                                    name="username"
                                    control={control}
                                    rules={{
                                        required: "Введите имя пользователя",
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
                                        <FormInput
                                            field={field}
                                            placeholder={action
                                                ? "Имя пользователя или Email"
                                                : "Имя пользователя"}
                                            error={!!errors.username}
                                        />
                                    )}
                                />
                            </div>

                            {!action && (
                                <div>
                                    <span className={style.errorMessage}>{errors.email?.message !== "Введите email" && errors.email?.message}</span>
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{
                                            required: "Введите email",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Некорректный email"
                                            }
                                        }}
                                        render={({ field }) => (
                                            <FormInput
                                                field={field}
                                                placeholder="Email"
                                                formType="email"
                                                error={!!errors.email}
                                            />
                                        )}
                                    />
                                </div>
                            )}

                            <div>
                                <span className={style.errorMessage}>{errors.password?.message !== "Введите пароль" && errors.password?.message}</span>
                                <Controller
                                    name="password"
                                    control={control}
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
                                    render={({ field }) => (
                                        <FormInput
                                            field={field}
                                            placeholder="Пароль"
                                            formType="password"
                                            error={!!errors.password}
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <span className={style.errorMessage}>{errors.password2?.message !== "Повторите пароль" && errors.password2?.message}</span>
                                {!action && (
                                    <Controller
                                        name="password2"
                                        control={control}
                                        rules={{
                                            required: "Повторите пароль",
                                            validate: (value) =>
                                                value === password || "Пароли не совпадают"
                                        }}
                                        render={({ field }) => (
                                            <FormInput
                                                field={field}
                                                placeholder="Повторите пароль"
                                                formType="password"
                                                error={!!errors.password2}
                                            />
                                        )}
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

                    <div>
                        <span>{action ? "Нет аккаунта?" : "Уже есть аккаунт?"}</span>
                        <button
                            type="button"
                            className={style.changeAction}
                            onClick={() => setAction(!action)}
                        >
                            {action ? "Зарегистрироваться" : "Войти"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
