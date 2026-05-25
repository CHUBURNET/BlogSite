import {Route, Routes} from "react-router-dom";
import HomePage from "./components/pages/HomePage.tsx";
import Navigation from "./components/modules/Navigation.tsx";
import GalleryPage from "./components/pages/GalleryPage.tsx";
import AuthPage from "./components/pages/AuthPage.tsx";
import ProfilePage from "./components/pages/ProfilePage.tsx";
import type {IUser} from "./types/userType.ts";
import {useSelector} from "react-redux";
import type {RootState} from "./redux/store.ts";
import PublicationPage from "./components/pages/PublicationPage.tsx";

const App = () => {
    const user: IUser = useSelector((state: RootState) => state.user);
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/me" element={<ProfilePage />} />
                {user.isAdmin && <Route path="/publication" element={<PublicationPage />} />}
            </Routes>
            <Navigation />
        </>
    );
};

export default App;