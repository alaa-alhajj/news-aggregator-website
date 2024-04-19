import { toast } from "react-toastify";

export const showAlertMessage = (type, message) => {
    if (type)
        toast.success(message);
    else
        toast.error(message);

}

export const isEmpty = (value) => {
    return (typeof value === "undefined" || typeof value === 'undefined' || typeof value === undefined || value === null || value === '' || value === "" || value.length === 0 || value === 'undefined');
}


export const checkIfValueExistInArray = (value, array) => {
    if ((isEmpty(array) && value === null) || value === null)
        return true
    let check = array.some(item => item === value)
    return check

}


export const checkIfValueExistInArrayByKey = (key, value, array) => {
    if ((isEmpty(array) && value === null) || value === null)
        return true
    let check = array.some(item => item[key] === value)
    return check

}

export const isObjectEmpty = (obj) => {
    return Object.keys(obj).length === 0;
}

export const findObjectInArrayByKey=(array, key, value)=> {
    if (!array)
        return {}

    return array.find(item => item[key] === value) ? array.find(item => item[key] === value) : null
}