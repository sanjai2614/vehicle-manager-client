// Auth APIs
export const REGISTER_URL = "/register/";
export const LOGIN_URL = "/login/";
export const REFRESH_URL = "/refresh/";
export const LOGOUT_URL = "/logout/";

// Current user
export const CURRENT_USER_URL = "/me/";

// Driver APIs
export const DRIVERS_URL = "/drivers/";
export const CREATE_DRIVER_URL = "/drivers/create/";
export const GET_DRIVER_URL = (id) => `/drivers/${id}/`;
export const UPDATE_DRIVER_URL = (id) => `/drivers/${id}/update/`;
export const DELETE_DRIVER_URL = (id) => `/drivers/${id}/delete/`;

// Dashboard APIs
export const USERS_URL = "/dashboard/users/";
export const UPDATE_USER_STATUS_URL = (id) => `/dashboard/users/${id}/status/`;
export const ALL_DRIVERS_URL = "/dashboard/drivers/";
export const DELETED_DRIVERS_URL = "/dashboard/deleted-drivers/";
