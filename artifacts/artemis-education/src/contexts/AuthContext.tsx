import {
  createContext,
  lazy,
  Suspense,
  useContext,
  type ReactNode,
} from "react";

export interface AppUser {
  firstName: string | null;
  imageUrl: string | null;
  email: string | null;
}

export interface AuthContextValue {
  isAuthEnabled: boolean;
  isSignedIn: boolean;
  user: AppUser | null;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  isAuthEnabled: false,
  isSignedIn: true,
  user: null,
  signOut: async () => {},
});

const demoUser: AppUser = {
  firstName: "Demo",
  imageUrl: "https://randomuser.me/api/portraits/lego/1.jpg",
  email: "demo@student.local",
};

const ClerkAuthProviderImpl = lazy(() => import("./ClerkAuthProviderImpl"));

interface AuthProviderProps {
  children: ReactNode;
  publishableKey?: string;
  proxyUrl?: string;
  routerPush: (to: string) => void;
  routerReplace: (to: string) => void;
}

function GuestAuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider
      value={{
        isAuthEnabled: false,
        isSignedIn: true,
        user: demoUser,
        signOut: async () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AppAuthProvider({
  children,
  publishableKey,
  proxyUrl,
  routerPush,
  routerReplace,
}: AuthProviderProps) {
  if (!publishableKey) {
    return <GuestAuthProvider>{children}</GuestAuthProvider>;
  }

  return (
    <Suspense fallback={<GuestAuthProvider>{children}</GuestAuthProvider>}>
      <ClerkAuthProviderImpl
        publishableKey={publishableKey}
        proxyUrl={proxyUrl}
        routerPush={routerPush}
        routerReplace={routerReplace}
      >
        {children}
      </ClerkAuthProviderImpl>
    </Suspense>
  );
}

export function useAppAuth() {
  return useContext(AuthContext);
}
