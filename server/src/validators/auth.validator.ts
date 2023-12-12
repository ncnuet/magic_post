import { IQueryableUser } from "@/types/auth";
import { InputError } from "@/types/controller";
import { ICreateUser } from "./user.validator";

export interface ILoginByPassword {
    username: string,
    password: string
    remember?: boolean
}

export interface IRequestReset extends IQueryableUser { }

export interface IResetPassword {
    password: string,
    re_password: string
}

export default class AuthValidator {
    private static validateUsername(username: string) {
        if (!username || username.length < 3 || username.length > 50)
            throw new InputError("Username có độ dài từ 3 đến 50 ký tự", "username");
        return true
    }

    private static validatePassword(password: string) {
        if (!password || password.length < 8 || password.length > 50)
            throw new InputError("Mật khẩu có độ dài từ 8 đến 50 ký tự", "password");
        return true
    }

    private static validateEmail(email: string) {
        if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            throw new InputError("Email không hợp lệ", "email");
        }
        return true
    }
    private static validateRePassword(password: string, re_password: string) {
        if (re_password != password) {
            throw new InputError("Mật khẩu nhập lại cần giống mật khẩu", "re_password");

        }
    }

    private static validatePhone(phone : string) {
        const phoneRegex = /^\+?[0-9]{1,4}[-. ]?([0-9]{1,4}[-. ]?){1,10}$/;

        if(!phoneRegex.test(phone)) {
            throw new InputError("Phone không hợp lệ", "phone");
        }

        return true;
    }

    static validateLoginPassword(data: ILoginByPassword) {
        AuthValidator.validateUsername(data.username)
        AuthValidator.validatePassword(data.password)
    }

    static validateRequestReset(data: IRequestReset) {
        data.username &&
            AuthValidator.validateUsername(data.username) ||
            AuthValidator.validateEmail(data.email)
    }

    static validateReset(data: IResetPassword) {
        AuthValidator.validatePassword(data.password)
        AuthValidator.validateRePassword(data.password, data.re_password);
    }

    static validateCreateUser (data : ICreateUser) {
        AuthValidator.validateUsername(data.username);
        AuthValidator.validateEmail(data.email);
        AuthValidator.validatePassword(data.password);
        AuthValidator.validatePhone(data.phone);
    }
}