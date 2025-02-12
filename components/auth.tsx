import React, { createContext, useContext, useState } from "react";
import { useRouter, useSegments } from "expo-router";

type User = {
    name: string;
    email: string;
    avatar: string;
};

type AuthContextType = {
    user: User | null;
    signOut: () => void;
    login: (email: string, password: string) => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    signOut: () => {},
    login: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>({
        name: "Jerel",
        email: "jerel@example.com",
        avatar: "https://i.pravatar.cc/300",
    });

    const router = useRouter();
    const segments = useSegments();

    React.useEffect(() => {
        const inAuthGroup = segments[0] === "(auth)";

        if (!user && !inAuthGroup) {
            router.replace("/login");
        } else if (user && inAuthGroup) {
            router.replace("/(tabs)");
        }
    }, [user, segments, router]);

    const signOut = () => {
        setUser(null);
        router.replace("/login");
    };

    const login = (email: string, password: string) => {
        setUser({
            name: "Jerel",
            email: email,
            avatar: "https://i.pravatar.cc/300",
        });
    };

    return (
        <AuthContext.Provider value={{ user, signOut, login }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
