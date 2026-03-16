import React from 'react';
import Message from "../modules/Message.tsx";
// import style from "../../styles/pages/HomePage.module.css"


const HomePage: React.FC = () => {
    return (
        <div className={"Page"}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item =>
                <Message
                    key={item}
                    images={[
                        "https://koldunov.com/wp-content/uploads/2021/03/06.jpg",
                        "https://www.sport-interfax.ru/ftproot/photos/photostory/2019/07/09/week4_700.jpg",
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR90KhIw90VRTCe8-xJxzq_n-NlizBaTY6hDQ&s",
                        "https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/11582/production/_103424017_mary-mcgowan_caught-in-the-act_00001294.jpg.webp"
                    ]}
                    text={"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis distinctio doloribus enim esse porro quae quod repellat repellendus saepe veniam."}
                    likes={item}
                    dislikes={item - 1}
                    isLiked={item % 2 === 0}
                    isDisliked={item % 2 !== 0 && item - 1 !== 0}
                />
            )}
        </div>
    );
};

export default HomePage;