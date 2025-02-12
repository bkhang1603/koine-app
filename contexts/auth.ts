export type AuthContextType = {
    user: {
        name: string;
        email: string;
        avatar: string;
    } | null;
    signOut: () => void;
    // ... other auth methods
}; 