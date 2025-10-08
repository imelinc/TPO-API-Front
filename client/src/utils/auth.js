export const getAuthToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token") || null;
export const isAuthenticated = () => Boolean(getAuthToken());
