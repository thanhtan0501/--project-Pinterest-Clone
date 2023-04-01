/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useRecoilState } from "recoil";

import Pins from "./Pins";
import { Login } from "../components";
import { userQuery } from "../utils/data";
import { client } from "../client";
import { fetchUser } from "../utils/fetchUser";
import { modalEditState, modalLoginState, pinState } from "../atoms";
import EditPin from "../components/EditPin";

const Home = () => {
    const [user, setUser] = useState(null);
    const scrollRef = useRef();
    const [isOpenLogin, setIsOpenLogin] = useRecoilState(modalLoginState);
    const [isOpenEdit, setIsOpenEdit] = useRecoilState(modalEditState);
    const [pin, setPin] = useRecoilState(pinState);

    const userInfo = fetchUser();
    useEffect(() => {
        const query = userQuery(userInfo?.sub);

        client.fetch(query).then((data) => {
            setUser(data[0]);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        scrollRef.current.scrollTo(0, 0);
    }, []);
    return (
        <div className="flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out">
            <div
                className="pb-2 flex-1 h-screen overflow-y-scroll"
                ref={scrollRef}
            >
                <Routes>
                    <Route path="/*" element={<Pins user={user && user} />} />
                </Routes>
            </div>
            {isOpenLogin && <Login />}
            {isOpenEdit && <EditPin pin={pin} />}
        </div>
    );
};

export default Home;
