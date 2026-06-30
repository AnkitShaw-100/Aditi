import { useCallback, useEffect, useMemo, useState } from "react";
import { SignInButton, SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-react";
import { ArrowRight, Download, RefreshCw, Save } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { apiRequest, downloadProtectedFile } from "@/lib/api";

const emptyProfile = {
  username: "",
  email: "",
  phone_number: "",
  dob: "",
  profile_completed_at: "",
};

const statusRank = {
  paid: 1,
  pending: 2,
  failed: 3,
  refunded: 4,
};

function uniqueMagazinesByBestStatus(purchases = []) {
  const bestByMagazine = new Map();

  purchases.forEach((purchase) => {
    const key = purchase.slug || purchase.id || purchase.razorpay_order_id;
    const current = bestByMagazine.get(key);
    const purchaseRank = statusRank[purchase.status] ?? 9;
    const currentRank = statusRank[current?.status] ?? 9;

    if (!current || purchaseRank < currentRank) {
      bestByMagazine.set(key, purchase);
    }
  });

  return Array.from(bestByMagazine.values());
}

export default function ProfilePage() {
  return (
    <section className="account-page min-h-screen px-4 pb-16 pt-28 md:px-8">
      <div className="mx-auto max-w-5xl">
        <SignedOut>
          <AuthRequiredPanel />
        </SignedOut>

        <SignedIn>
          <ProfilePanel />
        </SignedIn>
      </div>
    </section>
  );
}

function AuthRequiredPanel() {
  return (
    <div className="account-panel mx-auto max-w-xl p-6 text-center md:p-8">
      <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
        Account
      </p>
      <h1 className="mt-3 font-rajdhani text-4xl font-bold leading-none text-chalk">
        Sign in to complete your profile.
      </h1>
      <p className="mt-4 font-plex text-sm leading-7 text-ash">
        Your profile details are used for order records and magazine access.
      </p>
      <SignInButton mode="modal" forceRedirectUrl="/profile">
        <Button className="signin-button mt-6 h-11 rounded-none px-8 font-rajdhani text-lg font-bold">
          Sign In
        </Button>
      </SignInButton>
    </div>
  );
}

function ProfilePanel() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [profile, setProfile] = useState(emptyProfile);
  const [magazines, setMagazines] = useState([]);
  const [status, setStatus] = useState("loading");
  const [recoveryStatus, setRecoveryStatus] = useState("idle");
  const [autoRecoveryAttempted, setAutoRecoveryAttempted] = useState(false);
  const [message, setMessage] = useState("");

  const loadProfile = useCallback(async (shouldApply = () => true) => {
    try {
      await apiRequest(getToken, "/api/auth/sync-user", {
        method: "POST",
        body: JSON.stringify({
          username: user?.fullName || user?.username,
          email: user?.primaryEmailAddress?.emailAddress,
          phone_number: user?.primaryPhoneNumber?.phoneNumber,
        }),
      });
      const data = await apiRequest(getToken, "/api/me");

      if (!shouldApply()) return;

      setProfile({
        username: data.user?.username ?? "",
        email: data.user?.email ?? "",
        phone_number: data.user?.phone_number ?? "",
        dob: data.user?.dob ?? "",
        profile_completed_at: data.user?.profile_completed_at ?? "",
      });
      setMagazines(uniqueMagazinesByBestStatus(data.user?.magazines_bought ?? []));
      setStatus("ready");
    } catch (error) {
      if (!shouldApply()) return;
      setStatus("error");
      setMessage(error.message);
    }
  }, [getToken, user]);

  useEffect(() => {
    let active = true;

    loadProfile(() => active);

    return () => {
      active = false;
    };
  }, [loadProfile]);

  const isComplete = useMemo(
    () => profile.username && profile.email && profile.phone_number && profile.dob,
    [profile]
  );
  const profileLocked = status === "ready" && Boolean(profile.profile_completed_at);
  const hasPendingPurchase = magazines.some((magazine) => magazine.status === "pending");

  const recoverPendingPayments = useCallback(async ({ automatic = false } = {}) => {
    setRecoveryStatus("checking");

    if (!automatic) {
      setMessage("");
    }

    try {
      const data = await apiRequest(getToken, "/api/payments/razorpay/recover", {
        method: "POST",
      });

      setMagazines(uniqueMagazinesByBestStatus(data.user?.magazines_bought ?? []));
      setRecoveryStatus("idle");
      setMessage(data.message || "Payment check completed.");
    } catch (error) {
      setRecoveryStatus("error");

      if (!automatic) {
        setMessage(error.message);
      }
    }
  }, [getToken]);

  useEffect(() => {
    if (status !== "ready" || !hasPendingPurchase || autoRecoveryAttempted) {
      return;
    }

    setAutoRecoveryAttempted(true);
    recoverPendingPayments({ automatic: true });
  }, [autoRecoveryAttempted, hasPendingPurchase, recoverPendingPayments, status]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    try {
      const data = await apiRequest(getToken, "/api/me", {
        method: "PUT",
        body: JSON.stringify(profile),
      });

      setProfile({
        username: data.user?.username ?? "",
        email: data.user?.email ?? "",
        phone_number: data.user?.phone_number ?? "",
        dob: data.user?.dob ?? "",
        profile_completed_at: data.user?.profile_completed_at ?? "",
      });
      setMagazines(uniqueMagazinesByBestStatus(data.user?.magazines_bought ?? []));
      setStatus("ready");
      setMessage("Profile saved.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }

  async function downloadMagazine(magazine) {
    try {
      await downloadProtectedFile(
        getToken,
        `/api/magazines/${encodeURIComponent(magazine.slug)}/download`,
        `${magazine.slug}.pdf`
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
      <form className="account-panel p-5 md:p-7" onSubmit={handleSubmit}>
        <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
          User Profile
        </p>
        <h1 className="mt-3 font-rajdhani text-[clamp(2.2rem,7vw,4.5rem)] font-bold leading-none text-chalk">
          Complete your access details.
        </h1>
        <p className="mt-4 max-w-2xl font-plex text-sm leading-7 text-ash">
          These details stay in the PHP/MySQL backend and will be used for checkout, receipt email, and magazine access.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <ProfileField
            label="Name"
            value={profile.username}
            disabled={profileLocked}
            onChange={(value) => setProfile((current) => ({ ...current, username: value }))}
          />
          <ProfileField
            label="Email"
            type="email"
            value={profile.email}
            disabled={profileLocked}
            onChange={(value) => setProfile((current) => ({ ...current, email: value }))}
          />
          <ProfileField
            label="Phone Number"
            value={profile.phone_number}
            disabled={profileLocked}
            onChange={(value) => setProfile((current) => ({ ...current, phone_number: value }))}
          />
          <ProfileField
            label="Date of Birth"
            type="date"
            value={profile.dob}
            disabled={profileLocked}
            onChange={(value) => setProfile((current) => ({ ...current, dob: value }))}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            disabled={status === "saving" || profileLocked}
            className="final-button h-11 rounded-none px-6 font-rajdhani text-base font-bold"
          >
            <Save className="size-4" />
            {profileLocked ? "Profile Locked" : status === "saving" ? "Saving" : "Save Profile"}
          </Button>
          <Button
            asChild
            variant="ghost"
            className="h-11 rounded-none border border-steel/70 px-5 font-rajdhani text-base font-bold text-chalk hover:border-ember hover:bg-plate hover:text-chalk"
          >
            <Link to="/checkout">
              Go to Cart <ArrowRight className="size-4" />
            </Link>
          </Button>
          {message ? (
            <span className="font-plex text-sm text-ember">{message}</span>
          ) : null}
        </div>
      </form>

      <aside className="account-panel p-5 md:p-7">
        <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
          Readiness
        </p>
        <div className="mt-4 border-t border-steel/50 pt-4">
          <p className="font-rajdhani text-2xl font-bold text-chalk">
            {profileLocked
              ? "Ready for checkout"
              : isComplete
                ? "Review and save"
                : "Profile needs details"}
          </p>
          <p className="mt-3 font-plex text-sm leading-7 text-ash">
            {profileLocked
              ? "These details are saved and cannot be edited again from this page."
              : isComplete
                ? "Press Save Profile to confirm these details and unlock checkout."
                : "Name, email, phone number, and date of birth are required before payment."}
          </p>
        </div>
        <div className="mt-6 border-t border-steel/50 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-fog">
              Bought Magazines
            </p>
            {hasPendingPurchase ? (
              <Button
                type="button"
                variant="ghost"
                disabled={recoveryStatus === "checking"}
                className="h-9 rounded-none border border-ember/50 px-3 font-rajdhani text-sm font-bold text-chalk hover:border-ember hover:bg-plate hover:text-chalk"
                onClick={() => recoverPendingPayments()}
              >
                <RefreshCw className="size-4" />
                {recoveryStatus === "checking" ? "Checking" : "Verify Payment"}
              </Button>
            ) : null}
          </div>
          <div className="mt-3 grid gap-3">
            {magazines.length ? (
              magazines.map((magazine) => (
                <div key={`${magazine.id}-${magazine.razorpay_order_id}`} className="account-mini-row account-purchase-row">
                  <span className="account-purchase-title">{magazine.title}</span>
                  {magazine.status === "paid" ? (
                    <div className="account-download-actions">
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-12 rounded-none border border-steel/70 px-4 font-rajdhani text-base font-bold text-chalk hover:border-ember hover:bg-plate hover:text-chalk"
                        onClick={() => downloadMagazine(magazine)}
                      >
                        <Download className="size-4" />
                        PDF
                      </Button>
                    </div>
                  ) : (
                    <b>{magazine.status}</b>
                  )}
                </div>
              ))
            ) : (
              <p className="font-plex text-sm text-ash">No paid magazines yet.</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function ProfileField({ label, type = "text", value, disabled = false, onChange }) {
  return (
    <label className="account-field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
