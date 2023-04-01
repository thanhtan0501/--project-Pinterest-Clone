import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { modalEditState } from "../atoms";
import { client, urlFor } from "../client";
import { useNavigate } from "react-router-dom";

const EditPin = ({ pin }) => {
    const [title, setTitle] = useState("");
    const [focusTitle, setFocusTitle] = useState(false);
    const [destination, setDestination] = useState("");
    const [about, setAbout] = useState("");
    const [savingPost, setSavingPost] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useRecoilState(modalEditState);
    const editRef = useRef();
    const textareaRef = useRef(null);
    const navigate = useNavigate();

    console.log(about);
    useEffect(() => {
        let handler = (e) => {
            if (!editRef.current?.contains(e.target)) {
                setIsOpenEdit(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });
    const savePin = (id) => {
        if (title || about || destination) {
            setSavingPost(true);
            client
                .patch(id)
                .set({
                    title: `${title ? title : pin.title}`,
                    about: `${about ? about : pin.about}`,
                    destination: `${
                        destination ? destination : pin.destination
                    }`,
                })
                .commit()
                .then((data) => {
                    setSavingPost(false);
                    setIsOpenEdit(false);
                    navigate(`/pin-detail/${pin?._id}`);
                    window.location.reload();
                    // console.log(data);
                });
        }
    };
    useEffect(() => {
        textareaRef.current.style.height = "inherit";
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = scrollHeight + "px";
    }, [about]);

    return (
        <div
            className={`absolute  flex-col justify-center items-center inset-0 h-screen bg-blackOverlay z-50 shadow-lg transition-all duration-300 ease-in-out`}
        >
            <div className="flex fixed inset-0 px-4">
                <div
                    className="min-w-[300px] max-w-[900px] relative text-center min-h-[450px] opacity-100 rounded-[16px] m-auto bg-white shadow-[0_2px_10px_rgba(0,0,0,0.45)] animate-fade-in"
                    ref={editRef}
                >
                    <div className=" mx-auto w-full">
                        <h1 className="text-[32px] font-semibold tracking-[-1.2px] p-6 antialiased break-keep	">
                            Edit this Pin
                        </h1>
                    </div>
                    <div className="h-full md:min-h-[350px] px-4 pb-3 ">
                        <div className="flex flex-col-reverse max-h-[500px] md:max-h-full w-full sm:flex-row items-center sm:items-start sm:justify-center overflow-y-auto">
                            <div className="md:w-[586px] sm:w-[400px] w-full">
                                <div className="w-full py-3 px-4 flex flex-col md:flex-row items-start gap-2 justify-between border-b border-[#cdcdcd]">
                                    <label
                                        htmlFor="titleField"
                                        className="cursor-pointer w-[98px] text-left"
                                    >
                                        Title
                                    </label>
                                    <input
                                        id="titleField"
                                        type="text"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        // placeholder="Add your title"
                                        className="outline-none text-base overflow-hidden w-full max-w-full md:max-w-[370px] rounded-2xl px-4 py-2 border-[2px] border-[#cdcdcd] text-[#111] focus-within:border-[#0074E8] transition-all duration-300 ease-in-out"
                                        onFocus={() => setFocusTitle(true)}
                                        onBlur={() => setFocusTitle(false)}
                                    />
                                </div>
                                <div className="w-full py-3 px-4 flex flex-col gap-2 md:flex-row items-start justify-between border-b border-[#cdcdcd]">
                                    <label
                                        htmlFor="aboutField"
                                        className="cursor-pointer w-[98px] text-left"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        ref={textareaRef}
                                        id="aboutField"
                                        onChange={(e) => {
                                            setAbout(e.target.value);
                                        }}
                                        className="outline-none resize-none text-base min-h-[80px] max-w-full md:max-w-[370px] overflow-hidden w-full rounded-2xl px-4 py-2 border-[2px] border-[#cdcdcd] text-[#111] focus-within:border-[#0074E8] transition-all duration-300 ease-in-out text-left"
                                    >
                                        {about}
                                    </textarea>
                                </div>
                                <div className="w-full py-3 px-4 flex flex-col gap-2 md:flex-row items-start justify-between border-b border-[#cdcdcd]">
                                    <label
                                        htmlFor="destinationField"
                                        className="cursor-pointer w-[98px] text-left"
                                    >
                                        Website
                                    </label>
                                    <input
                                        id="destinationField"
                                        type="text"
                                        value={destination}
                                        onChange={(e) =>
                                            setDestination(e.target.value)
                                        }
                                        className="outline-none text-base overflow-hidden w-full max-w-full md:max-w-[370px] rounded-2xl px-4 py-2 border-[2px] border-[#cdcdcd] text-[#111] focus-within:border-[#0074E8] transition-all duration-300 ease-in-out"
                                    />
                                </div>
                            </div>
                            <div className="px-4 py-3">
                                <img
                                    className="w-full max-w-[400px] sm:max-w-[236px] rounded-[8px]"
                                    alt="user-post"
                                    src={urlFor(pin.image).width(2500).url()}
                                />
                            </div>
                        </div>
                    </div>

                    <div className=" sticky w-full rounded-b-[16px] bg-white bottom-0 left-0 flex flex-wrap items-center justify-between p-6 gap-2 border-t-[1px] border-[#EFEFEF]">
                        <div className="">
                            <button
                                type="button"
                                className="bg-black px-3 py-2 rounded-[24px] text-white text-[16px] font-semibold hover:bg-[#281818] transition-all duration-300 ease-in-out outline-none border-none hover:shadow-md"
                                onClick={() => setIsOpenEdit(false)}
                            >
                                Delete
                            </button>
                        </div>
                        <div className="flex flex-row gap-4 items-center justify-center">
                            <button
                                type="button"
                                className="px-3 py-2 flex items-center justify-center rounded-[24px] shadow hover:bg-[#0000000f] transition-all duration-300 ease-in-out outline-none"
                                onClick={() => setIsOpenEdit(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    savePin(pin._id);
                                }}
                                className="bg-[#E60023] px-3 py-2 rounded-[24px] text-white text-[16px] font-semibold hover:bg-[#bd001d] transition-all duration-300 ease-in-out outline-none border-none hover:shadow-md"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPin;
