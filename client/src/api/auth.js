import { AUTH, postJSON, getJSON } from "./client";

export const loginApi = ({ email, password }) => postJSON(AUTH.LOGIN, { email, password });
export const registerApi = (payload) => postJSON(AUTH.REGISTER, payload);
export const logoutApi = () => postJSON(AUTH.LOGOUT, {});
export const getUserInfo = (token) => getJSON(AUTH.ME, token);
