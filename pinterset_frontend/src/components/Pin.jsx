import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { client, urlFor } from "../client";
import { v4 as uuidv4 } from "uuid";

import { MdOutlineFileDownload } from "react-icons/md";
import { ArrowUpRightIcon, EditIcon, MenuIcon } from "../assets/icons";
import { fetchUser } from "../utils/fetchUser";
import { RiDeleteBinLine } from "react-icons/ri";
import { domains } from "../utils/data";
import EditPin from "./EditPin";
import { useRecoilState } from "recoil";
import { modalEditState, pinState } from "../atoms";
// pin: { image, postedBy, title, _id, destination, save, about, category },
const Pin = ({ pin }) => {
    const [postHovered, setPostHovered] = useState(false);
    const [postOptions, setPostOptions] = useState(false);
    const [savingPost, setSavingPost] = useState(false);
    const navigate = useNavigate();
    const user = fetchUser();
    const menuRef = useRef();
    const optionRef = useRef();
    const [isOpenEdit, setIsOpenEdit] = useRecoilState(modalEditState);
    const [pinData, setPinData] = useRecoilState(pinState);

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
    const alreadySaved = !!pin.save?.filter(
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
            num = pin?.destination.lastIndexOf(domain);
            lengthDomain = domain.length;
            return num !== -1 ? true : false;
        });
        return num > 0 ? num + lengthDomain : pin?.destination.length;
    };
    return (
        <div className="mx-2 my-4 relative ">
            <div
                className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-[16px] overflow-hidden transition-all duration-500 ease-in-out"
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => {
                    if (!postOptions) setPostHovered(false);
                }}
                onClick={() => navigate(`/pin-detail/${pin?._id}`)}
            >
                <img
                    className="w-full rounded-[16px]"
                    alt="user-post"
                    src={urlFor(pin.image).width(2500).url()}
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
                                        savePin(pin?._id);
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
                                {pin?.destination && (
                                    <a
                                        href={pin?.destination}
                                        className="bg-white flex items-center gap-2 text-[#111] text-[14px] font-semibold w-full h-8 rounded-full opacity-80 hover:opacity-90 hover:shadow-md outline-none py-2 px-3 overflow-hidden"
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <ArrowUpRightIcon className="w-[9px] h-[9px]" />
                                        {pin?.destination && (
                                            <p className="overflow-hidden text-ellipsis	whitespace-nowrap">
                                                {pin?.destination?.includes(
                                                    "https://"
                                                )
                                                    ? pin?.destination?.slice(
                                                          8,
                                                          checkUrl()
                                                      )
                                                    : pin?.destination?.slice(
                                                          0,
                                                          checkUrl()
                                                      )}
                                            </p>
                                        )}
                                    </a>
                                )}
                            </div>
                            <div className=" flex gap-2 grow-0">
                                {pin.postedBy?._id === user?.sub ? (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsOpenEdit(true);
                                            setPinData(pin);
                                        }}
                                        className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-[#111] text-xl opacity-80 hover:opacity-90 hover:shadow-md outline-none"
                                    >
                                        <EditIcon />
                                    </button>
                                ) : (
                                    <a
                                        href={`${pin.image?.asset?.url}?dl=`}
                                        download
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-[#111] text-xl opacity-80 hover:opacity-90 hover:shadow-md outline-none"
                                    >
                                        <MdOutlineFileDownload
                                            fontSize={21}
                                            title="Download"
                                        />
                                    </a>
                                )}
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
            {pin?.postedBy && (
                <div className="pt-2 px-[6px] pb-2 flex flex-col gap-1">
                    {pin?.title && (
                        <p
                            onClick={() => navigate(`/pin-detail/${pin?._id}`)}
                            className="font-semibold capitalize text-[#111] text-[14px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
                        >
                            {pin.title}
                        </p>
                    )}
                    <Link
                        to={`user-profile/${pin?.postedBy?._id}`}
                        className="flex gap-2 items-center"
                    >
                        <img
                            className="w-8 h-8 rounded-full object-cover"
                            src={pin.postedBy?.image}
                            alt="user-profile"
                        />
                        <p className="text-[#111] text-[14px] font-normal hover:underline max-w-[100%] overflow-hidden text-ellipsis whitespace-nowrap">
                            {pin?.postedBy?.userName}
                        </p>
                    </Link>
                </div>
            )}

            {postOptions && (
                <div
                    ref={optionRef}
                    className={`absolute min-h-[40px] min-w-[180px] max-w-[360px] max-h-[90vh] right-[-15px] shadow-[0px_0px_8px_rgba(0,0,0,0.1)] outline-none rounded-[16px] bg-white z-[60] ${
                        pin?.postedBy?._id === user?.sub
                            ? "bottom-[-108px]"
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
                                {pin?.postedBy?._id === user?.sub && (
                                    <>
                                        <div
                                            className="p-2 rounded-[8px] m-0 text-[16px] text-red-600 font-semibold hover:bg-[#e9e9e9] transition-all flex items-center gap-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPostOptions(!postOptions);
                                                deletePin(pin?._id);
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
