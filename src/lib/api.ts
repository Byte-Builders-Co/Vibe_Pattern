import axios, { AxiosRequestConfig } from "axios";
import { router } from "expo-router";
import { isEmpty } from "../utils/helper";
import { clearStore, getStoreValue } from "../utils/storage";

// const baseUrl = "";
const baseUrl = "";
const apiUrl = baseUrl + "api/";

export const imageUrl = () => `${baseUrl}storage/`;
const TIMEOUT = 30000;

export const apiActions = {
  login: "auth/login",
  register: "auth/register",
  logout: "auth/logout",
  forgot_password: "auth/forgot-password",
  reset_password: "auth/reset-password",
  version_check: "app-version",
};

export const api = {
  get login() {
    return `${apiUrl}auth/login`;
  },
  get register() {
    return `${apiUrl}auth/register`;
  },
  get logout() {
    return `${apiUrl}auth/logout`;
  },
};

const apiClient = axios.create({
  baseURL: apiUrl,
  timeout: TIMEOUT,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await getStoreValue({ key: "token" });
    if (!isEmpty(token)) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error adding token:", error);
  }
  return config;
});

const handleError = (response: any) => {
  if (response?.message === "Unauthenticated.") {
    clearStore();
    router.replace("/(auth)/login");
  }
};

export const sendRequest = async ({
  method = "post",
  url,
  data,
  headers,
  action = "login",
}: {
  method?: "get" | "post" | "put" | "delete";
  url?: string;
  data?: any;
  headers?: any;
  action?: keyof typeof apiActions;
}) => {
  try {
    const requestConfig: AxiosRequestConfig = {
      method,
      url: url || apiActions[action],
      data,
      headers,
    };
    console.log("Request Config -> ", requestConfig);

    const response = await apiClient.request(requestConfig);

    console.log("response from api -> ", response);
    // Successful response
    if (response?.status === 200 || response?.status === 201) {
      return {
        success: true,
        message:
          response.data?.message || response.data?.responseText || "Success",
        error: "",
        data: response.data?.responseData || null,
      };
    }

    return {
      success: false,
      message:
        response?.data?.message ||
        response.data?.responseText ||
        "Unexpected error occurred",
      data: null,
    };
  } catch (error: any) {
    const errorData = error?.response?.data || {};
    handleError(errorData);
    return {
      success: false,
      message:
        errorData?.message || errorData?.responseText || "Something went wrong",
      error: errorData?.errors || {},
      data: null,
    };
  }
};
