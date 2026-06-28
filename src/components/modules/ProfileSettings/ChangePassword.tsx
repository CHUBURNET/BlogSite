import React, {useState} from 'react';
import style from "../../../styles/modules/ProfileSettings/ChangePassword.module.css";
import {Controller, useForm} from "react-hook-form";
import FormInput from "../../UI/FormInput.tsx";
import Button from "../../UI/Button.tsx";
import {axiosInstance} from "../../../utils/api.ts";
import axios from "axios";
import type {LoadingState} from "../../../types/utilsType.ts";

interface INewPassword {
    oldPassword: string,
    newPassword: string
    newPassword2: string
}

interface IChangePassword {
    loading: LoadingState;
    setLoading: React.Dispatch<React.SetStateAction<LoadingState>>;
}

const ChangePassword: React.FC<IChangePassword> = ({loading, setLoading}) => {
    const [passwordError, setPasswordError] = useState<string>("");
    const {
        control: passwordControl,
        handleSubmit: handlePasswordSubmit,
        watch,
        // formState: { errors: passwordErrors }
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

    return (
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
    );
};

export default ChangePassword;