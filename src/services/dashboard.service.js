import { get, patch } from "../api/apiHelper";

import {
  USERS_URL,
  UPDATE_USER_STATUS_URL,
  ALL_DRIVERS_URL,
  DELETED_DRIVERS_URL,
} from "../api/urlHelper";

// Get all users
export const getUsers = () => get(USERS_URL);

// Update user active/inactive status
export const updateUserStatus = (id, payload) =>
  patch(UPDATE_USER_STATUS_URL(id), payload);

// Get all active drivers
export const getAllDrivers = () => get(ALL_DRIVERS_URL);

// Get deleted drivers
export const getDeletedDrivers = () => get(DELETED_DRIVERS_URL);
