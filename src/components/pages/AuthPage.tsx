import React, {useState} from 'react';
import style from "../../styles/pages/AuthPage.module.css";
import AuthFooter from "../UI/AuthFooter.tsx";
import AuthForm from "../modules/Auth/AuthForm.tsx";

const AuthPage: React.FC = () => {
    const [action, setAction] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

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

                    <AuthForm
                        setIsLoading={setIsLoading}
                        isLoading={isLoading}
                        setError={setError}
                        action={action}
                    />
                    <AuthFooter
                        action={action}
                        setAction={setAction}
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
