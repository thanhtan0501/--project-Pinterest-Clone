import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { client, urlFor } from "../client";
import { v4 as uuidv4 } from "uuid";

import { MdOutlineFileDownload } from "react-icons/md";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { domains, pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import {
    ArrowUpRightIcon,
    DeleteIcon,
    HeartIcon,
    MenuIcon,
    SendIcon,
} from "../assets/icons";
import { useRecoilState } from "recoil";
import { modalLoginState } from "../atoms";

const PinDetail = ({ user }) => {
    const [pins, setPins] = useState(null);
    const [pinDetail, setPinDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState("");
    const [addingComment, setAddingComment] = useState(false);
    const [savingPost, setSavingPost] = useState(false);
    const [isReadMore, setIsReadMore] = useState(true);
    const [postHovered, setPostHovered] = useState(false);
    const getSizeImage = useRef();
    const { pinId } = useParams();
    const navigate = useNavigate();
    const [isOpenLogin, setIsOpenLogin] = useRecoilState(modalLoginState);

    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

    const fetchPinDetail = () => {
        setLoading(true);
        let query = pinDetailQuery(pinId);
        if (query) {
            client.fetch(query).then((data) => {
                setPinDetail(data[0]);
                if (data[0]) {
                    query = pinDetailMorePinQuery(data[0]);
                    client.fetch(query).then((res) => {
                        setPins(res);
                        setLoading(false);
                    });
                }
            });
        }
    };
    const addComment = () => {
        if (comment) {
            setAddingComment(true);
            client
                .patch(pinId)
                .setIfMissing({ comments: [] })
                .insert("after", "comments[-1]", [
                    {
                        comment,
                        _key: uuidv4(),
                        postedBy: { _type: "postedBy", _ref: user._id },
                    },
                ])
                .commit()
                .then(() => {
                    fetchPinDetail();
                    setComment("");
                    setAddingComment(false);
                });
        }
    };

    const alreadySaved = !!pinDetail?.save?.filter(
        (item) => item?.postedBy?._id === user?.sub
    )?.length;
    const deletePin = (id) => {
        client.delete(id).then(() => {
            navigate("/");
            // window.location.reload();
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

    useEffect(() => {
        fetchPinDetail();
    }, [pinId]);

    if (!pinDetail) return <Spinner />;

    const checkUrl = () => {
        let num = 0;
        let lengthDomain = 0;
        domains.some((domain) => {
            num = pinDetail.destination.lastIndexOf(domain);
            lengthDomain = domain.length;
            return num !== -1 ? true : false;
        });
        return num > 0 ? num + lengthDomain : pinDetail.destination.length;
    };

    return (
        <div className="mt-8 px-2 md:px-4">
            <div
                className="flex flex-col min-[950px]:flex-row m-auto mb-4 bg-white shadow-[0_1px_20px_0_rgba(0,0,0,0.15)] min-[950px]:max-w-[1100px] max-w-[508px] min-h-[300px]"
                style={{ borderRadius: "32px" }}
            >
                <div
                    className={`flex items-center justify-center md:items-start p-5 relative `}
                    onMouseEnter={() => setPostHovered(true)}
                    onMouseLeave={() => setPostHovered(false)}
                >
                    <div className="relative">
                        <img
                            ref={getSizeImage}
                            src={
                                pinDetail?.image &&
                                urlFor(pinDetail.image).url()
                            }
                            className="rounded-[16px] w-full"
                            style={{ maxWidth: "468px" }}
                            alt="user-post"
                        />
                    </div>
                    {postHovered && (
                        <div
                            className={`absolute left-0 w-full p-10 flex flex-col justify-between z-50 top-0`}
                        >
                            <div className=" flex gap-2 grow">
                                <a
                                    href={
                                        pinDetail?.destination
                                            ? pinDetail?.destination
                                            : pinDetail.image.asset.url
                                    }
                                    className="bg-white h-[44px] flex items-center gap-2 text-[#111] text-[16px] font-semibold w-max rounded-full opacity-80 hover:opacity-90 hover:shadow-md outline-none py-2 px-4 overflow-hidden"
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <ArrowUpRightIcon className="w-4 h-4" />
                                    {pinDetail?.destination ? (
                                        <p className="overflow-hidden text-ellipsis	whitespace-nowrap">
                                            {pinDetail?.destination?.includes(
                                                "https://"
                                            )
                                                ? pinDetail?.destination?.slice(
                                                      8,
                                                      checkUrl()
                                                  )
                                                : pinDetail?.destination?.slice(
                                                      0,
                                                      checkUrl()
                                                  )}
                                        </p>
                                    ) : (
                                        <p>View image</p>
                                    )}
                                </a>
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-full pt-8 pb-5 flex-1 xl:min-w-620 relative flex justify-between flex-col">
                    <div className="flex flex-col p-8 pb-2 gap-5 justify-between">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-1 items-center">
                                <button
                                    // ref={menuRef}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // setPostOptions(!postOptions);
                                    }}
                                    className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-[#111] text-xl hover:shadow-md hover:bg-black/10 outline-none transition-all duration-500 ease-in-out"
                                >
                                    <MenuIcon className="w-5 h-5" />
                                </button>
                                <a
                                    href={`${pinDetail.image.asset.url}?dl`}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/10 text-[#111] text-xl hover:shadow-md outline-none transition-all duration-500 ease-in-out"
                                >
                                    <MdOutlineFileDownload
                                        fontSize={28}
                                        title="Download"
                                    />
                                </a>
                                {pinDetail?.postedBy?._id === user?._id && (
                                    <button
                                        type="button"
                                        className="bg-white hover:bg-black/10 w-12 h-12 rounded-full flex items-center justify-center text-[#111] text-xl hover:shadow-md outline-none transition-all duration-500 ease-in-out"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deletePin(pinDetail?._id);
                                        }}
                                    >
                                        <DeleteIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center justify-end">
                                {alreadySaved ? (
                                    <button
                                        type="button"
                                        className="bg-black opacity-80 hover:opacity-100 text-white font-bold px-4 py-3 text-base  rounded-3xl hover:shadow-md outline-none"
                                    >
                                        Saved
                                    </button>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (user) {
                                                savePin(pinDetail?._id);
                                            } else {
                                                setIsOpenLogin(true);
                                            }
                                        }}
                                        type="button"
                                        className="bg-[#e60023]  hover:bg-[#ad081b] text-white font-bold px-4 py-3 text-base  rounded-3xl hover:shadow-md outline-none"
                                    >
                                        {/* {savingPost ? "Saving" : "Save"} */}
                                        Save
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="h-full">
                            <div
                                className={`flex flex-col gap-3  overflow-y-auto `}
                                style={{
                                    maxHeight: `${
                                        getSizeImage?.current?.height > 450
                                            ? getSizeImage?.current?.height -
                                              200
                                            : 400
                                    }px`,
                                }}
                            >
                                <a
                                    href={pinDetail.destination}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="underline text-[#111] font-normal text-base"
                                >
                                    {pinDetail?.destination?.includes(
                                        "https://"
                                    )
                                        ? pinDetail?.destination?.slice(
                                              8,
                                              checkUrl()
                                          )
                                        : pinDetail?.destination?.slice(
                                              0,
                                              checkUrl()
                                          )}
                                </a>
                                <div
                                    className={`flex flex-col gap-4 relative ${
                                        isReadMore ? "mb-6" : "mb-1"
                                    }`}
                                >
                                    <a
                                        href={
                                            pinDetail?.destination
                                                ? pinDetail?.destination
                                                : pinDetail.image.asset.url
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[28px] text-[#111] font-semibold break-words"
                                    >
                                        {pinDetail?.title}
                                    </a>
                                    <p className="text-[#111] font-normal text-base">
                                        {pinDetail?.about?.length > 220
                                            ? isReadMore
                                                ? pinDetail?.about?.slice(
                                                      0,
                                                      200
                                                  ) +
                                                  (pinDetail?.about?.length >
                                                  220
                                                      ? "..."
                                                      : " ")
                                                : pinDetail?.about
                                            : pinDetail?.about}
                                        <span
                                            onClick={toggleReadMore}
                                            className={`font-semibold block absolute cursor-pointer truncate underline ${
                                                !isReadMore && "hidden"
                                            }`}
                                        >
                                            {isReadMore &&
                                                pinDetail?.about?.length >
                                                    220 &&
                                                "More"}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex flex-col gap-10">
                                    <Link
                                        to={`/user-profile/${pinDetail?.postedBy?._id}`}
                                        className="flex gap-2 items-center w-max"
                                    >
                                        <img
                                            className="w-12 h-12 rounded-full object-cover"
                                            src={pinDetail?.postedBy?.image}
                                            alt="user-profile"
                                        />
                                        <p className="text-[#111] text-[14px] font-semibold max-w-[100%] overflow-hidden text-ellipsis whitespace-nowrap">
                                            {pinDetail?.postedBy?.userName}
                                        </p>
                                    </Link>
                                    <div className="">
                                        <h2 className="text-[#111] text-[20px] font-semibold">
                                            Comments
                                        </h2>
                                        <div className=" flex gap-5 flex-col mt-5">
                                            {pinDetail?.comments?.map(
                                                (comment, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex gap-2 items-start bg-white rounded-lg"
                                                    >
                                                        <Link
                                                            to={`/user-profile/${comment?.postedBy?._id}`}
                                                            className="flex gap-2 items-center w-max"
                                                        >
                                                            <img
                                                                src={
                                                                    comment
                                                                        ?.postedBy
                                                                        ?.image
                                                                }
                                                                alt="user-profile"
                                                                className=" w-8 h-8 rounded-full cursor-pointer"
                                                            />
                                                        </Link>
                                                        <div>
                                                            <div className=" flex flex-row text-[16px] gap-1">
                                                                <Link
                                                                    to={`/user-profile/${comment?.postedBy?._id}`}
                                                                    className="flex gap-2 items-center w-max font-semibold hover:underline"
                                                                >
                                                                    {
                                                                        comment
                                                                            ?.postedBy
                                                                            ?.userName
                                                                    }
                                                                </Link>
                                                                <p className=" font-normal">
                                                                    {
                                                                        comment?.comment
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="flex flex-row gap-4 items-center text-[#5f5f5f]">
                                                                <p className=" text-[14px]">
                                                                    4w
                                                                </p>
                                                                <button
                                                                    // ref={menuRef}
                                                                    type="button"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        // setPostOptions(!postOptions);
                                                                    }}
                                                                    className="bg-white w-6 h-6 rounded-full flex items-center justify-center  hover:shadow-md hover:bg-black/10 outline-none transition-all duration-500 ease-in-out"
                                                                >
                                                                    <HeartIcon className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    // ref={menuRef}
                                                                    type="button"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        // setPostOptions(!postOptions);
                                                                    }}
                                                                    className="bg-white w-6 h-6 rounded-full flex items-center justify-center  hover:shadow-md hover:bg-black/10 outline-none transition-all duration-500 ease-in-out"
                                                                >
                                                                    <MenuIcon className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                            {addingComment && <Spinner />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {user && (
                        <div className=" sticky bg-white bottom-[-5px] left-0 flex flex-wrap items-center px-8 py-5 gap-2 border-t-[1px] border-[#EFEFEF]">
                            <Link
                                to={`/user-profile/${user?._id}`}
                                className="flex gap-2 items-center w-max"
                            >
                                <img
                                    className="w-12 h-12 rounded-full object-cover"
                                    src={user?.image}
                                    alt="user-profile"
                                />
                            </Link>
                            <input
                                className="flex-1 bg-[#e9e9e9] hover:bg-[#dadada] cursor-pointer border-gray-100 outline-none border-[1px] p-3 px-5 rounded-3xl focus:border-[#cdcdcd] focus:bg-white transition-all duration-300 ease-in-out p"
                                type="text"
                                placeholder="Add a comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button
                                className="bg-[#e60023] text-white rounded-full w-10 h-10 flex gap-2 items-center justify-center hover:bg-[#ad081b] transition-all duration-300 ease-in-out"
                                onClick={addComment}
                            >
                                {addingComment ? <SendIcon /> : <SendIcon />}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {loading && <Spinner />}
            {pins?.length > 0 && (
                <div className="flex items-center flex-col ">
                    <h2 className="text-[#111] font-semibold text-xl text-center py-3 px-6 mb-1 w-full">
                        More like this
                    </h2>
                    <MasonryLayout pins={pins} />
                </div>
            )}
        </div>
    );
};

export default PinDetail;
