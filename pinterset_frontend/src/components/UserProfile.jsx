import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlusIcon } from "../assets/icons";

import { client } from "../client";
import {
    userCreatedPinsQuery,
    userQuery,
    userSavedPinsQuery,
} from "../utils/data";
import { fetchUser } from "../utils/fetchUser";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const randomBackgroundImage =
    "https://source.unsplash.com/1600x900/?nature,photography,technology";
const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [pins, setPins] = useState(null);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("Created");
    const [activeBtn, setActiveBtn] = useState("Created");
    const navigate = useNavigate();
    const { userId } = useParams();
    const checkUser = fetchUser();

    useEffect(() => {
        const query = userQuery(userId);
        client.fetch(query).then((data) => {
            setUser(data[0]);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (text === "Created") {
            setPins(null);
            setLoading(true);
            const createdPinsQuery = userCreatedPinsQuery(userId);

            client.fetch(createdPinsQuery).then((data) => {
                setPins(data);
                setLoading(false);
            });
        } else if (text === "Saved") {
            setPins(null);
            setLoading(true);
            const savedPinsQuery = userSavedPinsQuery(userId);

            client.fetch(savedPinsQuery).then((data) => {
                setPins(data);
                setLoading(false);
            });
        }
    }, [text, userId]);

    if (!user) return <Spinner />;
    return (
        <div className="relative pb-2 h-full justify-center items-center">
            <div className="flex flex-col pb-5">
                <div className="relative flex flex-col mb-7">
                    <div className="flex flex-col  items-center justify-center">
                        <div className="flex flex-col items-center justify-center relative">
                            <img
                                src={randomBackgroundImage}
                                className="w-full h-370 max-w-[670px] rounded-[32px] 2xl:h-510 shadow-md object-cover"
                                alt="background"
                            />
                            {/* <div className="w-full h-370 max-w-[670px]"></div> */}
                            <div className="bg-white w-[125px] h-[125px] rounded-full absolute bottom-[-63px] flex items-center justify-center">
                                <img
                                    src={user.image}
                                    alt="avtart"
                                    className="rounded-full w-[120px] m-0 h-[120px] shadow-xl object-cover"
                                />
                            </div>
                        </div>
                        <div className="mt-[75px] flex flex-col items-center gap-2">
                            <h1 className="text-[#111] font-semibold text-[36px]">
                                {user.userName}
                            </h1>
                            {/* <span className="text-[#5f5f5f] text-[12px]">
                                @{user._id}
                            </span> */}
                        </div>
                    </div>
                </div>
                <div className="text-center mb-7 px-4 text-[#111] font-semibold text-base flex gap-4 items-center justify-center transition-all duration-300 ease-in-out">
                    <div className="relative w-max overflow-hidden">
                        <button
                            type="button"
                            onClick={(e) => {
                                setText(e.target.textContent);
                                setActiveBtn("Created");
                            }}
                            className={`${
                                activeBtn === "Created"
                                    ? " bg-transparent rounded-lg py-2 px-3 outline-none shimmer shimmerActive"
                                    : " bg-transparent rounded-lg py-2 px-3 hover:bg-[#e9e9e9] shimmer transition-all duration-300 ease-in-out"
                            }`}
                        >
                            Created
                        </button>
                    </div>
                    <div className="relative w-max overflow-hidden">
                        <button
                            type="button"
                            onClick={(e) => {
                                setText(e.target.textContent);
                                setActiveBtn("Saved");
                            }}
                            className={`${
                                activeBtn === "Saved"
                                    ? " bg-transparent rounded-lg py-2 px-3 outline-none shimmer shimmerActive"
                                    : "  bg-transparent rounded-lg py-2 px-3 hover:bg-[#e9e9e9] shimmer transition-all duration-300 ease-in-out"
                            }`}
                        >
                            Saved
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    {activeBtn === "Saved" && checkUser && (
                        <div className="flex flex-row items-center justify-between w-full px-4">
                            <div className="w-12 h-12 flex items-center justify-center hover:bg-[#e9e9e9] transition-all duration-300 ease-in-out rounded-full cursor-pointer">
                                <button
                                    type="button"
                                    onClick={() => navigate("/create-pin")}
                                >
                                    <PlusIcon />
                                </button>
                            </div>
                            <div className="w-12 h-12 flex items-center justify-center hover:bg-[#e9e9e9] transition-all duration-300 ease-in-out rounded-full cursor-pointer">
                                <button
                                    type="button"
                                    onClick={() => navigate("/create-pin")}
                                >
                                    <PlusIcon />
                                </button>
                            </div>
                        </div>
                    )}
                    {loading && <Spinner />}
                    {!loading && (
                        <>
                            {pins?.length ? (
                                <div className="px-2">
                                    <MasonryLayout pins={pins} />
                                </div>
                            ) : (
                                <>
                                    {activeBtn === "Saved" ? (
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <p>
                                                You haven't saved any Pins yet
                                            </p>
                                            <a
                                                type="button"
                                                href="/"
                                                className="bg-[#efefef] text-[#111] h-full min-h-[48px] hover:bg-[#e9e9e9] shadow px-4 py-3 rounded-full transition-all duration-300 ease-in-out"
                                            >
                                                Find ideas
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="p-12 flex flex-col justify-center items-center">
                                            <h2 className="font-semibold text-3xl">
                                                Inspire with an Idea Pin
                                            </h2>
                                            <div className="flex flex-col justify-center items-center py-4">
                                                <a
                                                    href="/create-pin"
                                                    className="bg-[#E60023] px-4 py-3 h-10 rounded-full text-white text-[16px] font-semibold hover:bg-[#bd001d] transition-all duration-300 outline-none border-none hover:shadow-md flex flex-col justify-center items-center"
                                                >
                                                    Create
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
