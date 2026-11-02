import { get, post, patch, del } from "../api/apiHelper";

import {
  DRIVERS_URL,
  CREATE_DRIVER_URL,
  GET_DRIVER_URL,
  UPDATE_DRIVER_URL,
  DELETE_DRIVER_URL,
} from "../api/urlHelper";

// Get logged-in user's drivers
export const getDrivers = () => get(DRIVERS_URL);

// Create driver
export const createDriver = (payload) => post(CREATE_DRIVER_URL, payload);

// Get single driver
export const getDriver = (id) => get(GET_DRIVER_URL(id));

// Update driver
export const updateDriver = (id, payload) =>
  patch(UPDATE_DRIVER_URL(id), payload);

// Soft delete driver
export const deleteDriver = (id) => del(DELETE_DRIVER_URL(id));
