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

export function getNumberFromLocalStorage(key, defaultValue = 0) {
    const value = Number(getFromLocalStorage(key));
    return Number.isFinite(value) ? value : defaultValue;
}
