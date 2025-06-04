import {
  ReactNode,
  createContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import {
  IAuthContext,
  IAuthContextAction,
  IAuthContextActionTypes,
  IAuthContextState,
  ILoginResponseDto,
} from "../types/auth.types";
import { getSession, setSession } from "./auth.utils";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  LOGIN_URL,
  ME_URL,
  PATH_AFTER_LOGIN,
  PATH_AFTER_LOGOUT,
  PATH_AFTER_REGISTER,
  REGISTER_URL,
} from "../utils/globalConfig";
import { getAccessToken, getRefreshToken } from "./session";
import { refreshToken as refreshTokenUtil } from "./auth.utils";

const authReducer = (state: IAuthContextState, action: IAuthContextAction) => {
  if (action.type === IAuthContextActionTypes.LOGIN) {
    return {
      ...state,
      isAuthenticated: true,
      isAuthLoading: false,
      user: action.payload,
    };
  }
  if (action.type === IAuthContextActionTypes.LOGOUT) {
    return {
      ...state,
      isAuthenticated: false,
      isAuthLoading: false,
      user: undefined,
    };
  }
  return state;
};

const initialAuthState: IAuthContextState = {
  isAuthenticated: false,
  isAuthLoading: true,
  user: undefined,
};

export const AuthContext = createContext<IAuthContext | null>(null);

interface IProps {
  children: ReactNode;
}

const AuthContextProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const navigate = useNavigate();

  const initializeAuthContext = useCallback(async () => {
    let token = getAccessToken();
    const refreshToken = getRefreshToken();

    // Nëse nuk ka token por ka refreshToken, provo të rifresko
    if (!token && refreshToken) {
      const refreshed = await refreshTokenFunction();
      if (!refreshed) {
        setSession(null, null);
        localStorage.removeItem("user");
        dispatch({ type: IAuthContextActionTypes.LOGOUT });
        return;
      }
      token = getAccessToken();
    }

    // Nëse ka token, VALIDOJE para se ta vendosh si të loguar
    if (token) {
      try {
        // SHTUAR: Testo token-in duke bërë një API call
        const response = await axiosInstance.get(ME_URL); // ose ndonjë endpoint tjetër për validation

        const userJson = localStorage.getItem("user");
        if (userJson && response.data) {
          const userInfo = JSON.parse(userJson);
          setSession(token, refreshToken);
          dispatch({
            type: IAuthContextActionTypes.LOGIN,
            payload: userInfo,
          });
          return;
        }
      } catch (error) {
        console.log("Token validation failed:", error);
        // Token i skaduar ose i pavlefshëm

        // Provo të rifresko token-in
        if (refreshToken) {
          const refreshed = await refreshTokenFunction();
          if (refreshed) {
            // Riprovo validimin pas refresh-it
            try {
              const newToken = getAccessToken();
              const response = await axiosInstance.get(ME_URL);
              const userJson = localStorage.getItem("user");

              if (userJson && response.data) {
                const userInfo = JSON.parse(userJson);
                setSession(newToken, refreshToken);
                dispatch({
                  type: IAuthContextActionTypes.LOGIN,
                  payload: userInfo,
                });
                return;
              }
            } catch (refreshError) {
              console.log(
                "Token validation failed after refresh:",
                refreshError
              );
            }
          }
        }

        // Nëse refresh dështon ose validation dështon përsëri
        setSession(null, null);
        localStorage.removeItem("user");
        dispatch({ type: IAuthContextActionTypes.LOGOUT });
        return;
      }
    }

    // Nëse nuk ka token fare
    setSession(null, null);
    localStorage.removeItem("user"); // SHTUAR: Sigurohu që user info është hequr
    dispatch({ type: IAuthContextActionTypes.LOGOUT });
  }, []);

  useEffect(() => {
    console.log("AuthContext Initialization start");
    initializeAuthContext()
      .then(() => console.log("initializeAuthContext was successfull"))
      .catch((error) => console.log(error));
  }, []);

  const register = useCallback(
    async (
      firstName: string,
      lastName: string,
      userName: string,
      email: string,
      password: string,
      address: string
    ) => {
      const response = await axiosInstance.post(REGISTER_URL, {
        firstName,
        lastName,
        userName,
        email,
        password,
        address,
      });
      console.log("Register Result:", response);
      toast.success("Register Was Successfull. Please Login.");
      navigate(PATH_AFTER_REGISTER);
    },
    []
  );

  const login = useCallback(async (userName: string, password: string) => {
    const response = await axiosInstance.post<ILoginResponseDto>(LOGIN_URL, {
      userName,
      password,
    });
    console.log("LOGIN RESPONSE DATA:", response.data);
    console.log("refreshToken nga response:", response.data.refreshToken);

    console.log("LOGIN RESPONSE DATA:", response.data);
    toast.success("Login Was Successful");

    const { newToken, refreshToken, userInfo } = response.data;
    setSession(newToken, refreshToken); // RUAN refreshToken në localStorage
    localStorage.setItem("user", JSON.stringify(userInfo));
    dispatch({
      type: IAuthContextActionTypes.LOGIN,
      payload: userInfo,
    });
    navigate(PATH_AFTER_LOGIN);
  }, []);

  // Logout Method
  const logout = useCallback(() => {
    setSession(null, null);
    localStorage.removeItem("user");
    dispatch({
      type: IAuthContextActionTypes.LOGOUT,
    });
    navigate(PATH_AFTER_LOGOUT);
  }, []);

  const valuesObject = {
    isAuthenticated: state.isAuthenticated,
    isAuthLoading: state.isAuthLoading,
    user: state.user,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={valuesObject}>{children}</AuthContext.Provider>
  );
};

const refreshTokenFunction = async (): Promise<boolean> => {
  const refreshed = await refreshTokenUtil();
  return refreshed;
};
export default AuthContextProvider;
