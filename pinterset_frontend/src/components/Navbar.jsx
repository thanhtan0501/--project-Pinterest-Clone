import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoMdSearch, IoMdAdd } from "react-icons/io";
import { CgCheck } from "react-icons/cg";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { LogoIcon } from "../assets/icons";
import { googleLogout } from "@react-oauth/google";
import { useRecoilState } from "recoil";
import { modalLoginState } from "../atoms";

const optionsMenu = [
    { name: "Setting", to: "/", icon: null, onClick: null },
    { name: "Terms Of Service", to: "/", icon: null, onClick: null },
    { name: "Privacy Policy", to: "/", icon: null, onClick: null },
    {
        name: "Log Out",
        icon: null,
        onClick: () => {
            googleLogout();
            localStorage.clear();
            window.location.reload();
        },
    },
];
const optionMenuNotSignIn = [
    { name: "About Pinterest", to: "/", icon: null, onClick: null },
    { name: "Terms Of Service", to: "/", icon: null, onClick: null },
    { name: "Privacy Policy", to: "/", icon: null, onClick: null },
];

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef();
    const [isOpenLogin, setIsOpenLogin] = useRecoilState(modalLoginState);

    useEffect(() => {
        let handler = (e) => {
            if (!menuRef.current?.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    return (
        <div className="flex gap-2 md:gap-1 w-full py-4 px-2 md:px-4">
            <div className="flex items-center justify-center ">
                <Link
                    to="/"
                    className="flex flex-row items-center justify-center w-[48px] h-full rounded-full hover:bg-[#e9e9e9] transition-all duration-300 ease-in-out"
                >
                    <LogoIcon />
                </Link>
            </div>
            <div className="hidden md:flex h-[48px]">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-black text-white h-full block  rounded-[24px]"
                            : "h-full bg-transparent block rounded-[24px] hover:bg-[#e9e9e9] transition-all duration-300 ease-in-out"
                    }
                >
                    <div className=" flex justify-center items-center px-5 h-full min-w-[60px]">
                        Home
                    </div>
                </NavLink>
            </div>
            {user && (
                <div className="hidden md:flex h-[48px]">
                    <NavLink
                        to="create-pin"
                        className={({ isActive }) =>
                            isActive
                                ? "bg-black text-white h-full block  rounded-[24px] transition-all duration-300 ease-in-out"
                                : "h-full bg-transparent block rounded-[24px] hover:bg-[#e9e9e9] transition-all duration-300 ease-in-out"
                        }
                    >
                        <div className=" flex justify-center items-center gap-1 px-4 h-full min-w-[60px]">
                            Create
                            <IoMdAdd />
                        </div>
                    </NavLink>
                </div>
            )}
            <div className="flex justify-start items-center w-full  h-[48px] px-2 rounded-[24px] bg-[#e9e9e9] border-none outline-none focus-within:shadow-md mx-2">
                <IoMdSearch fontSize={21} className="ml-1 " />
                <input
                    type="text"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search"
                    value={searchTerm}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") navigate("/search");
                    }}
                    className="p-2 w-full bg-transparent outline-none"
                />
            </div>
            <div className="flex items-center">
                {user ? (
                    <div className="flex items-center justify-center w-[48px] h-full rounded-full hover:bg-[#e9e9e9] transition-all duration-300 ease-in-out">
                        <NavLink
                            title="Your Profile"
                            to={`user-profile/${user._id}`}
                            className={({ isActive }) =>
                                isActive
                                    ? "w-[30px] h-[30px] flex items-center justify-center rounded-full border-2 border-[rgb(17,17,17)] transition-all duration-300 ease-in-out"
                                    : "w-[30px] h-[30px] flex items-center justify-center rounded-full transition-all duration-300 ease-in-out"
                            }
                        >
                            <img
                                src={user.image}
                                alt="your profile"
                                className="w-[24px] h-[24px] rounded-full m-0"
                            />
                        </NavLink>
                    </div>
                ) : (
                    <div className="flex h-[48px] w-full cursor-pointer mr-2">
                        <div className="bg-[#efefef] text-[#111] h-full whitespace-nowrap	flex  rounded-[24px] hover:bg-[#e9e9e9] transition-all duration-300 ease-in-out">
                            <button
                                type="button"
                                className=" flex justify-center items-center px-5 font-semibold text-[16px] transition-all duration-300 ease-in-out"
                                onClick={() => setIsOpenLogin(true)}
                            >
                                Sign in
                            </button>
                        </div>
                    </div>
                )}
                <div ref={menuRef} className="hidden md:block">
                    <div
                        className="w-auto h-max rounded-full cursor-pointer hover:bg-[#e9e9e9] transition-all duration-300 ease-in-out"
                        onClick={() => {
                            setOpen(!open);
                        }}
                    >
                        <MdOutlineKeyboardArrowDown
                            fontSize={25}
                            title="Account and more options"
                        />
                    </div>
                    {open && (
                        <div className="absolute min-h-[40px] min-w-[300px] max-w-[90vw] max-h-[90vh] top-[60px] right-[5px] shadow-[0px_0px_8px_rgba(0,0,0,0.1)] outline-none rounded-[16px] bg-white z-[70]">
                            <div className="bg-white relative overflow-auto m-2">
                                {user ? (
                                    <div className="w-full cursor-pointer flex flex-col gap-2 ">
                                        <div className="w-full">
                                            <div className="p-2 text-left text-[#111] font-normal text-[12px]">
                                                Your Account
                                            </div>
                                            <div className="flex-auto mx-0 flex flex-row items-center justify-between hover:bg-[#e9e9e9] transition-all rounded-[8px] p-2 ">
                                                <Link
                                                    to={`user-profile/${user._id}`}
                                                    className="flex flex-row gap-2 items-center"
                                                    onClick={() => {
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
                                                        <img
                                                            src={user.image}
                                                            className="w-full h-full object-cover"
                                                            alt="user-img"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-left text-[#111] text-base font-semibold">
                                                            {user.userName}
                                                        </div>
                                                        <div className="text-[#5f5f5f] break-words	text-sm">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div className="flex justify-center items-center flex-row">
                                                    <CgCheck
                                                        fontSize={25}
                                                        className="text-[#111]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full text-[#111]">
                                            <div className="p-2 text-left  font-normal text-[12px]">
                                                More Options
                                            </div>
                                            {optionsMenu.map((option) =>
                                                option.to ? (
                                                    <Link
                                                        to={option.to}
                                                        className="p-2 block rounded-[8px] m-0 text-[16px] font-semibold hover:bg-[#e9e9e9] transition-all"
                                                        onClick={() => {
                                                            setOpen(false);
                                                        }}
                                                        key={option.name}
                                                    >
                                                        {option.name}
                                                    </Link>
                                                ) : (
                                                    <div
                                                        key={option.name}
                                                        className="p-2 block rounded-[8px] m-0 text-[16px] font-semibold hover:bg-[#e9e9e9] transition-all"
                                                        onClick={
                                                            option.onClick
                                                                ? option.onClick
                                                                : () => {
                                                                      setOpen(
                                                                          false
                                                                      );
                                                                  }
                                                        }
                                                    >
                                                        {option.name}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full cursor-pointer flex flex-col gap-2 ">
                                        <div className="w-full text-[#111]">
                                            {optionMenuNotSignIn.map((option) =>
                                                option.to ? (
                                                    <Link
                                                        to={option.to}
                                                        className="p-2 block rounded-[8px] m-0 text-[16px] font-semibold hover:bg-[#e9e9e9] transition-all"
                                                        onClick={() => {
                                                            setOpen(false);
                                                        }}
                                                        key={option.name}
                                                    >
                                                        {option.name}
                                                    </Link>
                                                ) : (
                                                    <div
                                                        key={option.name}
                                                        to={option.to}
                                                        className="p-2 block rounded-[8px] m-0 text-[16px] font-semibold hover:bg-[#e9e9e9] transition-all"
                                                        onClick={
                                                            option.onClick
                                                                ? option.onClick
                                                                : () => {
                                                                      setOpen(
                                                                          false
                                                                      );
                                                                  }
                                                        }
                                                    >
                                                        {option.name}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
