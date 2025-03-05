import { useRouter } from "expo-router";
import {
  useCheckRefreshMutation,
  useRefreshAccessMutation,
} from "@/queries/useAuth";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "./app-provider";
import { AppState, AppStateStatus } from "react-native";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCheckingRefreshToken, setIsCheckingRefreshToken] = useState(true);

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

  //nó lỗi validation error
  useEffect(() => {
    const checkToken = async () => {
      try {
        console.log("initial data");
        const loginData = await SecureStore.getItemAsync("loginData");
        if (loginData) {
          const parsedData = JSON.parse(loginData);
          const refreshTk = parsedData.refreshToken;
          if (refreshTk) {
            const res = await refreshAccess.mutateAsync({
              refreshToken: refreshTk,
            });
            if (res) {
              const newAccess = {
                accessToken: res.data.accessToken,
                expiresAccess: res.data.expiresAccess,
              };

              setAccessToken(newAccess);
              setAccessExpired(false);
              state.setAccessToken(newAccess);
              state.setAccessExpired(false);

              setRefreshToken({
                refreshToken: refreshTk,
                expiresRefresh: parsedData.expiresRefresh,
              });
              setRefreshExpired(false);
              state.setRefreshToken({
                refreshToken: refreshTk,
                expiresRefresh: parsedData.expiresRefresh,
              });
              state.setRefreshExpired(false);
              setUser(parsedData.account);
              state.setUser(parsedData.account);
              setIsCheckingRefreshToken(false);
              console.log("get new access token success");
            }
          } else {
            console.log("refresh token not found");
            setRefreshExpired(true);
            clearAuth();
            await SecureStore.deleteItemAsync("loginData");
            setIsCheckingRefreshToken(false);
          }
        } else {
          console.log("Login data not found");
          setRefreshExpired(true);
          clearAuth();
          await SecureStore.deleteItemAsync("loginData");
          setIsCheckingRefreshToken(false);
        }
      } catch (error) {
        console.log("call api get new access failed, ", error);
        setRefreshExpired(true);
        clearAuth();
        await SecureStore.deleteItemAsync("loginData");
        setIsCheckingRefreshToken(false);
      }
    };

    checkToken();
  }, []);

  const state = useAppStore.getState();
  
  const getNewAccessToken = async () => {
    try {
      const state = useAppStore.getState(); // Lấy state mới nhất
      const currentRefreshToken = state.refreshToken;
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
        }
      }
    } catch (error) {
      setRefreshExpired(true);
      clearAuth();
      await SecureStore.deleteItemAsync("loginData");
      router.push("/(auth)/login?showModal=true&expired=true");
      console.log("Error when get new access token: ", error);
    }
  };

  useEffect(() => {
    if (isCheckingRefreshToken) return; // Chỉ chạy khi đã kiểm tra xong refresh token

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
  }, [appState, isCheckingRefreshToken]); // Thêm isCheckingRefreshToken vào dependencies

  return <>{children}</>;
};

export default AuthProvider;
