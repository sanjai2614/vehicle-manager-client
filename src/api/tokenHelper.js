export const saveAccessToken = (token) => {
  sessionStorage.setItem("accessToken", token);
};

export const getAccessToken = () => {
  return sessionStorage.getItem("accessToken");
};

export const clearAccessToken = () => {
  sessionStorage.removeItem("accessToken");
};