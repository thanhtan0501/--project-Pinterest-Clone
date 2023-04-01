import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteIcon, MenuIcon, UploadIcon, WarningIcon } from "../assets/icons";

import { client } from "../client";
import { categories } from "../utils/data";
import Spinner from "./Spinner";

const CreatePin = ({ user }) => {
    const [title, setTitle] = useState("");
    const [focusTitle, setFocusTitle] = useState(false);
    const [about, setAbout] = useState("");
    const [focusAbout, setFocusAbout] = useState(false);
    const [loading, setLoading] = useState(false);
    const [destination, setDestination] = useState("");
    const [fields, setFields] = useState();
    const [fieldsTitle, setFieldsTitle] = useState(false);
    const [category, setCategory] = useState();
    const [imageAsset, setImageAsset] = useState();
    const [wrongImageType, setWrongImageType] = useState(false);
    const [savingPost, setSavingPost] = useState(false);

    const navigate = useNavigate();
    const upLoadImage = (e) => {
        const { type, name } = e.target.files[0];
        if (
            type === "image/png" ||
            type === "image/svg" ||
            type === "image/gif" ||
            type === "image/tiff" ||
            type === "image/jpeg"
        ) {
            if (fields) setFields(false);
            setWrongImageType(false);
            setLoading(true);

            client.assets
                .upload("image", e.target.files[0], {
                    contentType: type,
                    filename: name,
                })
                .then((doc) => {
                    setImageAsset(doc);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            setWrongImageType(true);
        }
    };
    const savePin = () => {
        if (imageAsset?._id && title) {
            setSavingPost(true);
            setLoading(true);
            const doc = {
                _type: "pin",
                title,
                about,
                destination,
                image: {
                    _type: "image",
                    asset: {
                        _type: "reference",
                        _ref: imageAsset?._id,
                    },
                },
                userId: user._id,
                postedBy: {
                    _type: "postedBy",
                    _ref: user._id,
                },
                category,
            };
            client.create(doc).then(() => {
                setSavingPost(false);
                navigate("/");
            });
        } else {
            setFields(true);
            if (!title) setFieldsTitle(true);
            // setTimeout(() => {
            //     setFields(false);
            // }, 2000);
        }
    };
    return (
        <>
            <div className="py-[44px] bg-[#e9e9e9] h-full">
                <div className=" flex flex-col justify-start items-center lg:h-4/5 px-2 md:pr-8 md:pl-4 h-[100vh]">
                    <div className="flex flex-col gap-5 justify-center items-center bg-white lg:p-20 p-10 rounded-2xl max-w-[880px] w-full relative">
                        <div className="flex justify-between items-center w-full ">
                            <button
                                // ref={menuRef}
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // setPostOptions(!postOptions);
                                }}
                                className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-[#111] text-xl hover:bg-[#0000000f] transition-all duration-300 outline-none mx-3"
                            >
                                <MenuIcon />
                            </button>
                            <div className="flex">
                                <select
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                    className=" outline-none text-base text-[#111] bg-[#efefef]  px-[14px] rounded-l-lg cursor-pointer w-full h-auto"
                                >
                                    <option value="other" className="bg-white">
                                        Select Category
                                    </option>
                                    {categories.map((category) => (
                                        <option
                                            className="text-base border-0 outline-none capitalize bg-white text-[#111]"
                                            value={category.name}
                                            key={category.name}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    // ref={menuRef}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        savePin();
                                    }}
                                    className="bg-[#E60023] px-[14px] h-10 rounded-r-lg text-white text-[16px] font-semibold hover:bg-[#bd001d] transition-all duration-300 outline-none border-none hover:shadow-md"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row px-5 gap-5 w-full">
                            <div
                                className={`flex flex-1 w-[full] max-w-[340px] rounded-lg relative h-max 
                                ${
                                    fields
                                        ? "bg-[#FFE0E0] border-[#CC0000] border-2"
                                        : "bg-secondaryColor border-transparent border-2"
                                }  
                                ${imageAsset ? "px-0 py-5" : "p-3"}`}
                            >
                                <div
                                    className={`w-full rounded-md ${
                                        loading && "h-[470px]"
                                    }`}
                                >
                                    {loading && !savingPost && <Spinner />}
                                    {wrongImageType && (
                                        <p className="">Wrong Image Type!</p>
                                    )}
                                    {!imageAsset ? (
                                        <>
                                            {!loading && (
                                                <div className="flex justify-center items-center flex-col  border-2 border-dashed border-[#DADADA] p-3 w-full h-[470px] rounded-md">
                                                    <label className="cursor-pointer w-full h-full">
                                                        <div className="flex flex-col items-center justify-center h-full ">
                                                            {!fields ? (
                                                                <div className="flex flex-col justify-between items-center gap-6">
                                                                    <div className="font-bold text-2xl">
                                                                        <UploadIcon className="text-[#5f5f5f]" />
                                                                    </div>
                                                                    <p className="text-[16px] text-[#111] font-normal text-center">
                                                                        Drag and
                                                                        drop or
                                                                        click to
                                                                        upload
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col justify-between items-center gap-6">
                                                                    <div className="font-bold text-2xl">
                                                                        <WarningIcon className="text-[#c00]" />
                                                                    </div>
                                                                    <p className="text-[16px] text-[#c00] font-normal text-center">
                                                                        An image
                                                                        is
                                                                        required
                                                                        to
                                                                        create a
                                                                        Pin.
                                                                    </p>
                                                                </div>
                                                            )}
                                                            <div
                                                                className={`absolute z-20 m-[32px]  font-normal text-[14px] text-center left-0 right-0 bottom-0 ${
                                                                    fields
                                                                        ? "text-[#c00]"
                                                                        : "text-[#6C6C6C]"
                                                                }`}
                                                            >
                                                                Recommendation:
                                                                Use high-quality
                                                                .jpg, .svg, .png
                                                                or .gif files
                                                                less than 20MB
                                                            </div>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            name="upload-image"
                                                            onChange={(e) =>
                                                                upLoadImage(e)
                                                            }
                                                            className="hidden"
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="relative h-auto">
                                            <img
                                                src={imageAsset?.url}
                                                alt="uploaded-img"
                                                className="h-full w-full"
                                            />
                                            <button
                                                type="button"
                                                className="absolute z-[21] bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                                                onClick={() =>
                                                    setImageAsset(null)
                                                }
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col gap-4 md:pl-5 mt-8 w-full">
                                <div className="flex flex-1 flex-col gap-4">
                                    <div className="">
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                            placeholder="Add your title"
                                            className={`outline-none text-2xl sm:text-4xl w-full font-bold p-2 pt-[6px] pl-0 focus-within:border-b-[3px] focus-within:border-[#0074E8] transition-all duration-300 ease-in-out ${
                                                fieldsTitle
                                                    ? "border-[#CC0000] border-b-[3px] placeholder:text-red-400"
                                                    : "border-b-[3px] border-gray-200 text-[#111]"
                                            } `}
                                            rows={1}
                                            onFocus={() => {
                                                setFocusTitle(true);
                                                if (fieldsTitle)
                                                    setFieldsTitle(false);
                                            }}
                                            onBlur={(e) => {
                                                setFocusTitle(false);
                                                if (fields && !e.target.value)
                                                    setFieldsTitle(true);
                                            }}
                                        />
                                        <div className="text-[#5f5f5f] text-[11px] mt-1 h-[15px]">
                                            {focusTitle && (
                                                <div>
                                                    <p>
                                                        Your first 40 characters
                                                        are what usually show up
                                                        in feeds
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {user && (
                                        <div className="flex gap-2 mb-3 items-center bg-white rounded-lg">
                                            <img
                                                src={user.image}
                                                className="w-12 h-12 rounded-full"
                                                alt="avatar"
                                            />
                                            <p className="font-semibold text-[#111]">
                                                {user.userName}
                                            </p>
                                        </div>
                                    )}
                                    <div className="">
                                        <input
                                            type="text"
                                            value={about}
                                            onChange={(e) =>
                                                setAbout(e.target.value)
                                            }
                                            placeholder="Tell everyone what your Pin is about"
                                            className=" outline-none text-[#9197a3] text-base w-full font-normal border-b-[3px] border-gray-200 p-2 pt-[6px] pb-5 pl-5 focus-within:border-[#0074E8] focus-within:border-b-[3px] transition-all duration-300 ease-in-out"
                                            onFocus={() => setFocusAbout(true)}
                                            onBlur={() => setFocusAbout(false)}
                                        />
                                        <div className="text-[#5f5f5f] text-[11px] mt-1 h-[15px]">
                                            {focusAbout && (
                                                <div>
                                                    <p>
                                                        People will usually see
                                                        the first 50 characters
                                                        when they click on your
                                                        Pin
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <input
                                        type="url"
                                        value={destination}
                                        onChange={(e) =>
                                            setDestination(e.target.value)
                                        }
                                        placeholder="Add a destination link"
                                        className=" outline-none text-[#9197a3] text-base w-full font-normal border-b-[3px] border-gray-200 p-2 pt-[6px] pl-0 focus-within:border-[#0074E8] focus-within:border-b-[3px] transition-all duration-300 ease-in-out"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {savingPost && (
                <div className=" bg-white opacity-80 w-full h-full absolute z-[22] inset-0">
                    {loading && <Spinner />}
                </div>
            )}
        </>
    );
};

export default CreatePin;
