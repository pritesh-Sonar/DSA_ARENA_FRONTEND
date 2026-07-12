import axiosInstance from "../../../services/api/axiosInstance";
import { AUTH_ENDPOINTS } from "../../../constants/apiEndpoints";

export const login = async (username, password) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, {
    username,
    password,
  });
  return response.data.data; // unwraps your ApiResponse<T> "data" field
};

export const signup = async (username, password) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.SIGNUP, {
    username,
    password,
  });
  return response.data.data;
};