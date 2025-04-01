import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";
import NetInfo from "@react-native-community/netinfo";
import { useAppStore } from "@/components/app-provider";
import { AccessTokenType } from "@/model/access-token";
import { LOCAL_HOST, DEPLOY_HOST } from "@/config";

interface SocketContextType {
  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connectSocket: () => {},
  disconnectSocket: () => {},
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const accessToken: AccessTokenType | null = useAppStore(
    (state) => state.accessToken
  );
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const hasConnected = useRef(false);

  const connectSocket = useCallback(() => {
    if (!accessToken?.accessToken || socketRef.current) return;

    console.log("⚡️ Kết nối socket với token:", accessToken.accessToken);
    const newSocket = io(`${DEPLOY_HOST}`, {
      auth: { Authorization: `Bearer ${accessToken.accessToken}` },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 5000,
      forceNew: true,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      newSocket.emit("login", { token: accessToken.accessToken });
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      socketRef.current = null;
    });
  }, [accessToken]);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      console.log("🛑 Ngắt kết nối socket");
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
    }
  }, []);

  useEffect(() => {
    if (accessToken?.accessToken && !hasConnected.current) {
      hasConnected.current = true;
      connectSocket();
    } else if (!accessToken?.accessToken) {
      disconnectSocket();
      hasConnected.current = false;
    }
  }, [accessToken]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && !socketRef.current) connectSocket();
    });

    return () => unsubscribe();
  }, [connectSocket]);

  return (
    <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
