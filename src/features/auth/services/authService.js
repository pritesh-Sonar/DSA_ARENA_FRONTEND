import axiosInstance from "../../../services/api/axiosInstance";
import { AUTH_ENDPOINTS } from "../../../constants/apiEndpoints";

export const login = async (username, password) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, {
    username,
    password,
  });
  return response.data.data;
};

export const sendOtp = async (username, email, password) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.SEND_OTP, {
    username,
    email,
    password,
  });
  return response.data;
};

export const verifyOtp = async (email, otpCode) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.VERIFY_OTP, {
    email,
    otpCode,
  });
  return response.data.data;
};

export const forgotPassword = async (email) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  return response.data;
};

export const resetPassword = async (email, otpCode, newPassword) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
    email,
    otpCode,
    newPassword,
  });
  return response.data;
};

export const getGoogleLoginUrl = () => {
  return "http://localhost:8080/oauth2/authorization/google";
};