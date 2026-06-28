import { useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import { LogIn, ShoppingCart, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { clerkUserButtonAppearance } from "@/lib/clerkAppearance";
import { cn } from "@/lib/utils";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";
const CLERK_ENABLED = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const syncedSessions = new Set();

export default function AuthNavButton({ mobile = false, compact = false }) {
  if (!CLERK_ENABLED) {
    return (
      <Button
        type="button"
        disabled
        className={cn(
          "auth-nav-button h-10 rounded-none border border-ember/45 bg-ember/10 px-4 font-rajdhani text-sm font-bold uppercase tracking-[0.16em] text-ember shadow-none",
          compact && "h-9 px-3 text-xs tracking-[0.12em]",
          mobile && "h-12 w-full justify-center text-base"
        )}
        title="Add VITE_CLERK_PUBLISHABLE_KEY in frontend/.env"
      >
        {compact ? "Sign Up" : "Sign In"}
      </Button>
    );
  }

  return (
    <div className={cn("auth-nav", mobile && "auth-nav--mobile", compact && "auth-nav--compact")}>
      <SignedOut>
        <SignInButton mode="modal" forceRedirectUrl="/">
          <Button
            type="button"
            className={cn(
              "auth-nav-button h-10 rounded-none border border-ember/55 bg-ember px-4 font-rajdhani text-sm font-bold uppercase tracking-[0.16em] text-void shadow-none hover:border-chalk hover:bg-chalk hover:text-void",
              compact && "h-9 px-3 text-xs tracking-[0.12em]",
              mobile && "h-12 w-full justify-center text-base"
            )}
          >
            <LogIn className={cn("size-4", compact && "hidden sm:block")} />
            {compact ? "Sign Up" : "Sign In"}
          </Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SyncClerkUser />
        <div
          className={cn(
            "auth-user-chip flex h-10 items-center gap-2 border-0 bg-transparent px-0",
            compact && "h-9 gap-2",
            mobile && "h-auto w-full flex-wrap justify-center py-2"
          )}
        >
          <Button
            asChild
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-none border-0 bg-transparent text-chalk hover:bg-transparent hover:text-ember",
              compact && "text-chalk"
            )}
            title="Cart"
          >
            <Link to="/checkout" aria-label="Cart">
              <ShoppingCart className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-none border-0 bg-transparent text-chalk hover:bg-transparent hover:text-ember",
              compact && "text-chalk"
            )}
            title="Profile"
          >
            <Link to="/profile" aria-label="Profile">
              <UserRound className="size-4" />
            </Link>
          </Button>
          {!compact ? <UserLabel /> : null}
          <UserButton
            appearance={clerkUserButtonAppearance}
            userProfileProps={{ appearance: clerkUserButtonAppearance }}
          />
        </div>
      </SignedIn>
    </div>
  );
}

function UserLabel() {
  const { user } = useUser();
  const label =
    user?.firstName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "Account";

  return (
    <span className="max-w-[9rem] truncate font-plex text-xs font-medium uppercase tracking-[0.14em] text-chalk">
      {label}
    </span>
  );
}

function SyncClerkUser() {
  const { getToken, sessionId, isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isSignedIn || !isLoaded || !user || !sessionId || syncedSessions.has(sessionId)) {
      return;
    }

    const controller = new AbortController();

    async function syncUser() {
      const token = await getToken();

      if (!token) {
        return;
      }

      const response = await fetch(`${BACKEND_URL}/api/auth/sync-user`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.fullName || user.username,
          email: user.primaryEmailAddress?.emailAddress,
          phone_number: user.primaryPhoneNumber?.phoneNumber,
        }),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || data.message || "Unable to sync Clerk user");
      }

      syncedSessions.add(sessionId);
    }

    syncUser().catch((error) => {
      if (error.name !== "AbortError") {
        console.error("Unable to sync Clerk user", error);
        syncedSessions.delete(sessionId);
      }
    });

    return () => controller.abort();
  }, [getToken, isLoaded, isSignedIn, sessionId, user]);

  return null;
}
