import { useRouter } from "expo-router";
import {
  useCheckRefreshMutation,
  useRefreshAccessMutation,
} from "@/queries/useAuth";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "./app-provider";
import { AppState, AppStateStatus } from "react-native";
import { RoleValues } from "@/constants/type";
import { useShippingInfos } from "@/queries/useShippingInfos";
import { useCart } from "@/queries/useCart";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );
  //có thể fetch luôn my course đồ ở đây luôn

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const refreshAccess = useRefreshAccessMutation();
  const checkRefresh = useCheckRefreshMutation();
  const router = useRouter();

  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const setAccessExpired = useAppStore((state) => state.setAccessExpired);

  const setRefreshToken = useAppStore((state) => state.setRefreshToken);
  const setRefreshExpired = useAppStore((state) => state.setRefreshExpired);
  const clearAuth = useAppStore((state) => state.clearAuth);
  const setUser = useAppStore((state) => state.setUser);

  const updateRefs = () => {
    appStateRef.current = AppState.currentState;
  };

  const state = useAppStore.getState();
  const currentAccessToken = state.accessToken;
  const currentUser = state.user;
  const token = currentAccessToken?.accessToken ?? "";

  // Gọi API shipping
  const {
    data: shippingData,
    isLoading: isLoadingShipping,
    isError: isErrorShipping,
    error: shippingError
  } = useShippingInfos(
    token && currentUser?.role === RoleValues[0] ? { token } : { token: "" }
  );

  // Gọi API cart
  const {
    data: cartData,
    isLoading: isLoadingCart,
    isError: isErrorCart,
    error: cartError
  } = useCart(
    token && currentUser?.role === RoleValues[0] ? { token } : { token: "" }
  );
 

  // Xử lý lỗi nếu có
  if (isErrorShipping) {
    console.error("Lỗi khi lấy thông tin shipping:", shippingError);
  }

  if (isErrorCart) {
    console.error("Lỗi khi lấy giỏ hàng:", cartError);
  }

  const getNewAccessToken = async () => {
    try {
      const state = useAppStore.getState(); // Lấy state mới nhất
      const currentRefreshToken = state.refreshToken;
      console.log(currentRefreshToken?.refreshToken)
      if (currentRefreshToken) {
        const res = await refreshAccess.mutateAsync({
          refreshToken: currentRefreshToken.refreshToken,
        });
        if (res?.data) {
          const newAccess = {
            accessToken: res.data.accessToken,
            expiresAccess: res.data.expiresAccess,
          };
          setAccessToken(newAccess);
          setAccessExpired(false);
          state.setAccessToken(newAccess);
          state.setAccessExpired(false);
          console.log("get new access token success");
        } else {
          throw new Error("Failed to refresh access token");
        }
      }
    } catch (error) {
      console.log("Error when get new access token: ", error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("initialize auth running at auth provider");
      try {
        const loginData = await SecureStore.getItemAsync("loginData");
        if (loginData) {
          const parsedData = JSON.parse(loginData);
          if (parsedData) {
            const expiresRefresh = parsedData.expiresRefresh;
            const expiresTime = new Date(expiresRefresh.toString());
            const currentTime = new Date();
            const timeDifference =
              expiresTime.getTime() - currentTime.getTime();
            const fiveMinutesInMs = 5 * 60 * 1000;

            if (
              (timeDifference > 0 && timeDifference < fiveMinutesInMs) ||
              timeDifference <= 0
            ) {
              setRefreshExpired(true);
              clearAuth();
              await SecureStore.deleteItemAsync("loginData");
              return;
            } else {
              setRefreshExpired(false);
              const refreshTk = {
                refreshToken: parsedData.refreshToken,
                expiresRefresh: parsedData.expiresRefresh,
              };
              setRefreshToken(refreshTk);
              setUser(parsedData.account);

              const expiresAccess = parsedData.expiresAccess;
              const expiresTime = new Date(expiresAccess.toString());
              const currentTime = new Date();
              const timeDifference =
                expiresTime.getTime() - currentTime.getTime();
              const fiveMinutesInMs = 5 * 60 * 1000;

              if (
                (timeDifference > 0 && timeDifference < fiveMinutesInMs) ||
                timeDifference <= 0
              ) {
                await getNewAccessToken();
              } else {
                setAccessExpired(false);
                const accessTk = {
                  accessToken: parsedData.accessToken,
                  expiresAccess: parsedData.expiresAccess,
                };
                setAccessToken(accessTk);
              }
            }
          }
        } else {
          setRefreshExpired(true);
        }
      } catch (error) {
        console.error(
          "Failed to load token and user from secure storage: ",
          error
        );
      }
    };
    initializeAuth();
    //trước đây thì để refresh và access token trong dependencies nhưng tạm thời thấy k cần nữa
    //có thể back lại
  }, []);

  useEffect(() => {
    const startInterval = () => {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(async () => {
          const state = useAppStore.getState(); // Lấy state mới nhất
          const currentAccessToken = state.accessToken;
          const currentRefreshToken = state.refreshToken;

          const checkExpiresAccessToken = async () => {
            if (currentAccessToken) {
              const expiresTime = new Date(currentAccessToken.expiresAccess);
              const currentTime = new Date();
              const timeDifference =
                expiresTime.getTime() - currentTime.getTime();
              const fiveMinutesInMs = 5 * 60 * 1000;

              if (
                (timeDifference > 0 && timeDifference < fiveMinutesInMs) ||
                timeDifference <= 0
              ) {
                setAccessExpired(true);
                console.log("Access token sắp/đã hết hạn, thực hiện refresh.");
                await getNewAccessToken();
              }
            }
          };

          const checkExpiresRefreshToken = async () => {
            if (currentRefreshToken) {
              const expiresTime = new Date(currentRefreshToken.expiresRefresh);
              const currentTime = new Date();
              const timeDifference =
                expiresTime.getTime() - currentTime.getTime();
              const fiveMinutesInMs = 5 * 60 * 1000;

              if (
                (timeDifference > 0 && timeDifference < fiveMinutesInMs) ||
                timeDifference <= 0
              ) {
                setRefreshExpired(true);
                console.log("Refresh token sắp/đã hết hạn, thực hiện refresh.");
                clearAuth();
                await SecureStore.deleteItemAsync("loginData");
                router.push("/(auth)/login?showModal=true&expired=true");
              }
            }
          };

          const checkRefreshToken = async () => {
            if (currentAccessToken && currentRefreshToken) {
              const res = await checkRefresh.mutateAsync({
                accessToken: currentAccessToken.accessToken,
              });
              if (res?.data) {
                const newestRefreshToken = res.data;
                if (newestRefreshToken !== currentRefreshToken.refreshToken) {
                  setRefreshExpired(true);
                  clearAuth();
                  await SecureStore.deleteItemAsync("loginData");
                  console.log("Refresh token different with the one in server");
                  router.push("/(auth)/login?showModal=true&expired=false");
                }
              } else {
                throw new Error("Failed to check refresh token");
              }
            }
          };

          await checkExpiresAccessToken();
          await checkExpiresRefreshToken();
          await checkRefreshToken();
        }, 4000);
      }
    };

    const clearIntervalTask = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (appState === "active") {
      clearIntervalTask(); // Xóa interval cũ trước khi tạo mới
      startInterval();
    } else if (appState === "inactive" || appState === "background") {
      clearIntervalTask();
    }

    return () => clearIntervalTask();
  }, [appState]);

  return <>{children}</>;
};

export default AuthProvider;
