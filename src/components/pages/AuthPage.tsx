import React, {useState} from 'react';
import style from "../../styles/pages/AuthPage.module.css"
import Button from "../UI/Button.tsx";
import Input from "../UI/Input.tsx";

const AuthPage: React.FC = () => {
    const [action, setAction] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Логика отправки данных
        console.log("Submit form");
    };

    return (
        <div className="Page">
            <div className={style.container}>
                <div className={style.content}>
                    <h2>{action ? "Вход" : "Регистрация"}</h2>

                    <form onSubmit={handleSubmit}>
                        <div className={style.inputs}>
                            <Input
                                placeholder={action ? "Имя пользователя или Email" : "Имя пользователя"}
                                formType="text"
                                style={{ width: '100%' }}
                            />
                            {!action && (
                                <Input
                                    placeholder="Email"
                                    formType="email"
                                    style={{ width: '100%' }}
                                />
                            )}
                            <Input
                                placeholder="Пароль"
                                formType="password"
                                style={{ width: '100%' }}
                            />
                            {!action && (
                                <Input
                                    placeholder="Повторите пароль"
                                    formType="password"
                                    style={{ width: '100%' }}
                                />
                            )}
                        </div>

                        <Button
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