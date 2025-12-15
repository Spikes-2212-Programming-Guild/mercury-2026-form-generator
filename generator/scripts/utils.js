import {APP_ID} from "./constants.js";

export function setToLocalStorage(key, value) {
    localStorage.setItem(APP_ID + key, value);
}

export function getFromLocalStorage(key) {
    return localStorage.getItem(APP_ID + key);
}

export function removeFromLocalStorage(key) {
    return localStorage.removeItem(APP_ID + key);
}
