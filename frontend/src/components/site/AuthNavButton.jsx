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
import { cn } from "@/lib/utils";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";
const CLERK_ENABLED = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const syncedSessions = new Set();

export default function AuthNavButton({ mobile = false }) {
  if (!CLERK_ENABLED) {
    return (
      <Button
        type="button"
        disabled
        className={cn(
          "auth-nav-button h-10 rounded-none border border-ember/45 bg-ember/10 px-4 font-rajdhani text-sm font-bold uppercase tracking-[0.16em] text-ember shadow-none",
          mobile && "h-12 w-full justify-center text-base"
        )}
        title="Add VITE_CLERK_PUBLISHABLE_KEY in frontend/.env"
      >
        Sign In
      </Button>
    );
  }

  return (
    <div className={cn("auth-nav", mobile && "auth-nav--mobile")}>
      <SignedOut>
        <SignInButton mode="modal" forceRedirectUrl="/">
          <Button
            type="button"
            className={cn(
              "auth-nav-button h-10 rounded-none border border-ember/55 bg-[linear-gradient(135deg,#c99a4a,#8a713f)] px-4 font-rajdhani text-sm font-bold uppercase tracking-[0.16em] text-void shadow-[0_12px_28px_rgba(0,0,0,0.25)] hover:border-chalk hover:bg-chalk hover:text-void",
              mobile && "h-12 w-full justify-center text-base"
            )}
          >
            <LogIn className="size-4" />
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SyncClerkUser />
        <div
          className={cn(
            "auth-user-chip flex h-10 items-center gap-2 border border-white/10 bg-white/5 px-2",
            mobile && "h-auto w-full flex-wrap justify-center py-2"
          )}
        >
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none border border-steel/60 text-fog hover:border-ember hover:bg-plate hover:text-chalk"
            title="Profile"
          >
            <Link to="/profile" aria-label="Profile">
              <UserRound className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none border border-steel/60 text-fog hover:border-ember hover:bg-plate hover:text-chalk"
            title="Cart"
          >
            <Link to="/checkout" aria-label="Cart">
              <ShoppingCart className="size-4" />
            </Link>
          </Button>
          <UserLabel />
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "h-8 w-8 rounded-none border border-ember/50 shadow-none",
                userButtonPopoverCard:
                  "rounded-none border border-[#3b402f] bg-[#090b08] text-[#f2eada]",
                userButtonPopoverActionButton:
                  "font-plex text-[#d8d2c0] hover:bg-[#202719] hover:text-[#f2eada]",
              },
            }}
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

    syncedSessions.add(sessionId);

    const controller = new AbortController();

    async function syncUser() {
      const token = await getToken();

      if (!token) {
        return;
      }

      await fetch(`${BACKEND_URL}/api/auth/sync-user`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: user.fullName || user.username,
          gmail: user.primaryEmailAddress?.emailAddress,
          phone_number: user.primaryPhoneNumber?.phoneNumber,
          address: user.publicMetadata?.address,
        }),
        signal: controller.signal,
      });
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
