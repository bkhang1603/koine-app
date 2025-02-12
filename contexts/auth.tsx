import React, { createContext, useContext, useState } from "react";
import { useRouter, useSegments } from "expo-router";

type AuthContextType = {
    user: {
        name: string;
        email: string;
        avatar: string;
    } | null;
    signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    signOut: () => {},
});

// Mock user data
const MOCK_USER = {
    id: "1",
    name: "Nguyễn Văn A",
    email: "example@email.com",
    avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=3B82F6&color=fff&size=128",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user] = useState({
        name: "Jerel",
        email: "jerel@example.com",
        avatar: "https://i.pravatar.cc/300",
    });
    const rootSegment = useSegments()[0];
    const router = useRouter();

    React.useEffect(() => {
        if (!user && rootSegment !== "(auth)") {
            router.replace("/login");
        } else if (user && rootSegment === "(auth)") {
            router.replace("/(tabs)");
        }
    }, [user, rootSegment]);

    const signOut = () => {
        // Handle sign out
    };

    return (
        <AuthContext.Provider value={{ user, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext); 