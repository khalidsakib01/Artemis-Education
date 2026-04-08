import { ClerkProvider, useClerk, useUser } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { AuthContext, type AuthContextValue } from "./AuthContext";

interface ClerkAuthProviderImplProps {
  children: ReactNode;
  publishableKey: string;
  proxyUrl?: string;
  routerPush: (to: string) => void;
  routerReplace: (to: string) => void;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const previousUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        previousUserIdRef.current !== undefined &&
        previousUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      previousUserIdRef.current = userId;
    });

    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function ClerkAuthBridge({ children }: { children: ReactNode }) {
  const clerk = useClerk();
  const { user, isSignedIn } = useUser();

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthEnabled: true,
      isSignedIn: Boolean(isSignedIn),
      user: user
        ? {
            firstName: user.firstName ?? null,
            imageUrl: user.imageUrl ?? null,
            email: user.primaryEmailAddress?.emailAddress ?? null,
          }
        : null,
      signOut: async () => {
        await clerk.signOut({ redirectUrl: "/" });
      },
    }),
    [clerk, isSignedIn, user],
  );

  return (
    <AuthContext.Provider value={value}>
      <ClerkQueryClientCacheInvalidator />
      {children}
    </AuthContext.Provider>
  );
}

export default function ClerkAuthProviderImpl({
  children,
  publishableKey,
  proxyUrl,
  routerPush,
  routerReplace,
}: ClerkAuthProviderImplProps) {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      proxyUrl={proxyUrl}
      routerPush={routerPush}
      routerReplace={routerReplace}
    >
      <ClerkAuthBridge>{children}</ClerkAuthBridge>
    </ClerkProvider>
  );
}
