import React, {useState} from 'react';
import style from "../../styles/pages/ProfileSettingsPage.module.css"
import ProfileInfo from "../modules/ProfileSettings/ProfileInfo.tsx";
import type {LoadingState} from "../../types/utilsType.ts";
import ChangePassword from "../modules/ProfileSettings/ChangePassword.tsx";
import Logout from "../modules/ProfileSettings/Logout.tsx";



const ProfileSettingsPage: React.FC = () => {
    const [loading, setLoading] = useState<LoadingState>("idle");

    return (
        <div className={style.page}>
            <ProfileInfo
                loading={loading}
                setLoading={setLoading}
            />
            <ChangePassword
                loading={loading}
                setLoading={setLoading}
            />
            <Logout
                loading={loading}
                setLoading={setLoading}
            />
        </div>
    );
};

export default ProfileSettingsPage;
