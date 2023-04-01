import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import {
    CreatePin,
    Feed,
    Navbar,
    PinDetail,
    Search,
    UserProfile,
} from "../components";

const Pins = ({ user }) => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="">
            <div className="bg-gray-50 shadow-sm relative">
                <Navbar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    user={user}
                ></Navbar>
            </div>
            <div className="h-full">
                <Routes>
                    <Route path="/" element={<Feed />} />
                    <Route path="/category/:categoryId" element={<Feed />} />
                    <Route
                        path="/user-profile/:userId"
                        element={<UserProfile />}
                    />
                    <Route
                        path="/pin-detail/:pinId"
                        element={<PinDetail user={user} />}
                    />
                    <Route
                        path="/create-pin"
                        element={<CreatePin user={user} />}
                    />
                    <Route
                        path="/search"
                        element={
                            <Search
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                            />
                        }
                    />
                </Routes>
            </div>
        </div>
    );
};

export default Pins;
