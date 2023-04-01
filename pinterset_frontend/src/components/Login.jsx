import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import jwt_decode from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";

import { CloseIcon, LogoIcon } from "../assets/icons";
import { modalLoginState } from "../atoms";
import { client } from "../client";

const Login = () => {
    // eslint-disable-next-line no-unused-vars
    const [isOpenLogin, setIsOpenLogin] = useRecoilState(modalLoginState);
    const loginRef = useRef();
    const navigate = useNavigate();

    const responseGoogle = async (res) => {
        const decode = jwt_decode(res.credential);
        localStorage.setItem("user", JSON.stringify(decode));
        const { name, picture, sub, email } = decode;
        const doc = {
            _id: sub,
            _type: "user",
            userName: name,
            image: picture,
            email: email,
        };
        client.createIfNotExists(doc).then(() => {
            navigate(`/${doc._id}`, { replace: true });
        });
        window.location.reload();
    };

    useEffect(() => {
        let handler = (e) => {
            if (!loginRef.current?.contains(e.target)) {
                setIsOpenLogin(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    return (
        <div
            className={`absolute  flex-col justify-center items-center inset-0 h-screen bg-blackOverlay z-50 shadow-lg transition-all duration-300 ease-in-out`}
        >
            <div className="flex fixed inset-0">
                <div
                    className="min-w-[300px] max-w-[484px] relative text-center min-h-[450px] opacity-100 rounded-[32px] m-auto bg-white shadow-[0_2px_10px_rgba(0,0,0,0.45)] px-[10px] pt-[20px] pb-[24px] animate-fade-in"
                    ref={loginRef}
                >
                    <div className="h-[45px] w-[45px] mt-[8px] mx-auto mb-[6px]">
                        <LogoIcon className="w-[50px] h-[50px]" />
                    </div>
                    <div className="mt-0 mb-[22px] mx-auto w-full">
                        <h1 className="text-[32px] font-semibold tracking-[-1.2px] pl-4 pr-4 antialiased break-keep	">
                            Sign in
                        </h1>
                    </div>
                    <div>
                        <div className="flex flex-col items-center justify-center gap-2">
                            <GoogleLogin
                                locale="en"
                                onSuccess={(res) => responseGoogle(res)}
                                onError={() => console.log("error")}
                                shape="circle"
                                text="signin_with"
                                type="standard" //icon
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        className="absolute top-0 right-0 w-10 h-10 m-4 flex items-center justify-center rounded-full hover:bg-[#0000000f] transition-all duration-300 outline-none"
                        onClick={() => setIsOpenLogin(false)}
                    >
                        <CloseIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
