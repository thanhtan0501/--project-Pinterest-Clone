import { atom } from "recoil";

export const modalLoginState = atom({
    key: "modalLoginState",
    default: false,
});
export const modalEditState = atom({
    key: "modalEditState",
    default: false,
});
export const pinState = atom({
    key: "pinState",
    default: {},
});
