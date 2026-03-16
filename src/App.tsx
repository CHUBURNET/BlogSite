import {Route, Routes} from "react-router-dom";
import HomePage from "./components/pages/HomePage.tsx";
import Navigation from "./components/modules/Navigation.tsx";
import SurprisePage from "./components/pages/SurprisePage.tsx";
import AuthPage from "./components/pages/AuthPage.tsx";

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/surprise" element={<SurprisePage />} />
            </Routes>
            <Navigation />
        </>
    );
};

export default App;