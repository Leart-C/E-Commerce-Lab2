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
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken && refreshToken) {
      const refreshed = await refreshTokenFunction(); // thirrja për refresh
      if (!refreshed) {
        setSession(null);
        dispatch({ type: IAuthContextActionTypes.LOGOUT });
        return;
      }
    }

    const token = getAccessToken();
    if (token) {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        const userInfo = JSON.parse(userJson);
        setSession(token);
        dispatch({
          type: IAuthContextActionTypes.LOGIN,
          payload: userInfo,
        });
      }
    } else {
      setSession(null);
      dispatch({ type: IAuthContextActionTypes.LOGOUT });
    }
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
    toast.success("Login Was Successful");

    const { newToken, userInfo } = response.data;
    setSession(newToken);
    localStorage.setItem("user", JSON.stringify(userInfo));
    dispatch({
      type: IAuthContextActionTypes.LOGIN,
      payload: userInfo,
    });
    navigate(PATH_AFTER_LOGIN);
  }, []);

  // Logout Method
  const logout = useCallback(() => {
    setSession(null);
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

export default AuthContextProvider;
function refreshTokenFunction() {
  throw new Error("Function not implemented.");
}
