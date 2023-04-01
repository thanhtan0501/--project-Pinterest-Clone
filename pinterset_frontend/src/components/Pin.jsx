import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { client, urlFor } from "../client";
import { v4 as uuidv4 } from "uuid";

import { MdOutlineFileDownload } from "react-icons/md";
import { ArrowUpRightIcon, MenuIcon } from "../assets/icons";
import { fetchUser } from "../utils/fetchUser";
import { RiDeleteBinLine } from "react-icons/ri";
import { domains } from "../utils/data";

const Pin = ({ pin: { image, postedBy, title, _id, destination, save } }) => {
    const [postHovered, setPostHovered] = useState(false);
    const [postOptions, setPostOptions] = useState(false);
    const [savingPost, setSavingPost] = useState(false);
    const navigate = useNavigate();
    const user = fetchUser();
    const menuRef = useRef();
    const optionRef = useRef();

    useEffect(() => {
        let handler = (e) => {
            if (!menuRef.current?.contains(e.target)) {
                if (!optionRef.current?.contains(e.target)) {
                    setPostOptions(false);
                    setTimeout(() => setPostHovered(false), 300);
                }
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    const alreadySaved = !!save?.filter(
        (item) => item?.postedBy?._id === user?.sub
    )?.length;

    // ID user  |   Array of users like post    |   -(filter)->  |  length  |   !     -> !        | alreadySaved
    // 1        |   [2, 3, 1]                   |    [1]         |  1       |   false -> true     | true
    // 4        |   [2, 3, 1]                   |    []          |  0       |   true  -> false    | false
    const deletePin = (id) => {
        client.delete(id).then(() => {
            window.location.reload();
        });
    };
    const savePin = (id) => {
        if (!alreadySaved) {
            setSavingPost(true);
            client
                .patch(id)
                .setIfMissing({ save: [] })
                .insert("after", "save[-1]", [
                    {
                        _key: uuidv4(),
                        userId: user?.sub,
                        postedBy: {
                            _type: "postedBy",
                            _ref: user?.sub,
                        },
                    },
                ])
                .commit()
                .then(() => {
                    // window.location.reload();
                    setSavingPost(false);
                });
        }
    };

    const checkUrl = () => {
        let num = 0;
        let lengthDomain = 0;
        domains.some((domain) => {
            num = destination.lastIndexOf(domain);
            lengthDomain = domain.length;
            return num !== -1 ? true : false;
        });
        return num > 0 ? num + lengthDomain : destination.length;
    };
    return (
        <div className="mx-2 my-4 relative ">
            <div
                className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-[16px] overflow-hidden transition-all duration-500 ease-in-out"
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => {
                    if (!postOptions) setPostHovered(false);
                }}
                onClick={() => navigate(`/pin-detail/${_id}`)}
            >
                <img
                    className="w-full rounded-[16px]"
                    alt="user-post"
                    src={urlFor(image).width(2500).url()}
                />
                {postHovered && (
                    <div
                        className="absolute top-0 w-full h-full flex flex-col justify-between p-3 z-50"
                        style={{
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        <div className="flex items-center justify-end relative">
                            {alreadySaved ? (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    className="bg-black opacity-80 hover:opacity-100 text-white font-bold px-4 py-3 text-base  rounded-3xl hover:shadow-md outline-none"
                                >
                                    Saved
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        savePin(_id);
                                    }}
                                    type="button"
                                    className="bg-[#e60023]  hover:bg-[#ad081b] text-white font-bold px-4 py-3 text-base  rounded-3xl hover:shadow-md outline-none"
                                >
                                    {/* {savingPost ? "Saving" : "Save"} */}
                                    Save
                                </button>
                            )}
                        </div>

                        <div className="flex items-center justify-between gap-2 w-full">
                            <div className=" flex gap-2 grow max-w-[65%]">
                                {destination && (
                                    <a
                                        href={destination}
                                        className="bg-white flex items-center gap-2 text-[#111] text-[14px] font-semibold w-full h-8 rounded-full opacity-80 hover:opacity-90 hover:shadow-md outline-none py-2 px-3 overflow-hidden"
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <ArrowUpRightIcon className="w-[9px] h-[9px]" />
                                        {destination && (
                                            <p className="overflow-hidden text-ellipsis	whitespace-nowrap">
                                                {destination?.includes(
                                                    "https://"
                                                )
                                                    ? destination?.slice(
                                                          8,
                                                          checkUrl()
                                                      )
                                                    : destination?.slice(
                                                          0,
                                                          checkUrl()
                                                      )}
                                            </p>
                                        )}
                                    </a>
                                )}
                            </div>
                            <div className=" flex gap-2 grow-0">
                                <a
                                    href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-[#111] text-xl opacity-80 hover:opacity-90 hover:shadow-md outline-none"
                                >
                                    <MdOutlineFileDownload fontSize={21} />
                                </a>
                                <button
                                    ref={menuRef}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPostOptions(!postOptions);
                                    }}
                                    className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-[#111] text-xl opacity-80 hover:opacity-90 hover:shadow-md outline-none"
                                >
                                    <MenuIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {postedBy && (
                <div className="pt-2 px-[6px] pb-4 flex flex-col gap-1">
                    {title && (
                        <p
                            onClick={() => navigate(`/pin-detail/${_id}`)}
                            className="font-semibold capitalize text-[#111] text-[14px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
                        >
                            {title}
                        </p>
                    )}
                    <Link
                        to={`user-profile/${postedBy?._id}`}
                        className="flex gap-2 items-center"
                    >
                        <img
                            className="w-8 h-8 rounded-full object-cover"
                            src={postedBy?.image}
                            alt="user-profile"
                        />
                        <p className="text-[#111] text-[14px] font-normal hover:underline max-w-[100%] overflow-hidden text-ellipsis whitespace-nowrap">
                            {postedBy?.userName}
                        </p>
                    </Link>
                </div>
            )}

            {postOptions && (
                <div
                    ref={optionRef}
                    className={`absolute min-h-[40px] min-w-[180px] max-w-[360px] max-h-[90vh] right-[-15px] shadow-[0px_0px_8px_rgba(0,0,0,0.1)] outline-none rounded-[16px] bg-white z-[60] ${
                        postedBy?._id === user?.sub
                            ? "bottom-[-145px]"
                            : "bottom-[-68px]"
                    }`}
                >
                    <div className="bg-white relative overflow-auto m-2">
                        <div className="w-full cursor-pointer flex flex-col gap-2 ">
                            <div className="w-full text-[#111]">
                                <div className="p-2 text-left text-[#111] font-normal text-[14px]">
                                    This Pin was inspired by your recent
                                    activity
                                </div>
                                <div
                                    className="p-2 block rounded-[8px] m-0 text-[16px] font-semibold hover:bg-[#e9e9e9] transition-all"
                                    onClick={(e) => {
                                        setPostOptions(false);
                                    }}
                                >
                                    Hide Pin
                                </div>
                                <div
                                    className="p-2 block rounded-[8px]  m-0 text-[16px] font-semibold hover:bg-[#e9e9e9] transition-all"
                                    onClick={(e) => {
                                        setPostOptions(false);
                                    }}
                                >
                                    Report Pin
                                </div>
                                {postedBy?._id === user?.sub && (
                                    <>
                                        <div
                                            className="p-2 rounded-[8px] m-0 text-[16px] font-semibold hover:bg-[#e9e9e9] transition-all "
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPostOptions(!postOptions);
                                            }}
                                        >
                                            Edit Pin
                                        </div>
                                        <div
                                            className="p-2 rounded-[8px] m-0 text-[16px] text-red-600 font-semibold hover:bg-[#e9e9e9] transition-all flex items-center gap-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPostOptions(!postOptions);
                                                deletePin(_id);
                                            }}
                                        >
                                            <RiDeleteBinLine />
                                            Delete Pin
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pin;
