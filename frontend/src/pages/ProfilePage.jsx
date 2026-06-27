import { useEffect, useMemo, useState } from "react";
import { SignInButton, SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-react";
import { ArrowRight, Download, Save } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { apiRequest, downloadProtectedFile } from "@/lib/api";

const emptyProfile = {
  user_name: "",
  gmail: "",
  phone_number: "",
  address: "",
};

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
        Your profile details are used for order records, invoice data, and magazine access.
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
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        await apiRequest(getToken, "/api/auth/sync-user", {
          method: "POST",
          body: JSON.stringify({
            user_name: user?.fullName || user?.username,
            gmail: user?.primaryEmailAddress?.emailAddress,
            phone_number: user?.primaryPhoneNumber?.phoneNumber,
          }),
        });
        const data = await apiRequest(getToken, "/api/me");

        if (!active) return;

        setProfile({
          user_name: data.user?.user_name ?? "",
          gmail: data.user?.gmail ?? "",
          phone_number: data.user?.phone_number ?? "",
          address: data.user?.address ?? "",
        });
        setMagazines(data.user?.magazines_bought ?? []);
        setStatus("ready");
      } catch (error) {
        if (!active) return;
        setStatus("error");
        setMessage(error.message);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [getToken, user]);

  const isComplete = useMemo(
    () => profile.user_name && profile.gmail && profile.phone_number && profile.address,
    [profile]
  );
  const profileLocked = status === "ready" && Boolean(isComplete);

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
        user_name: data.user?.user_name ?? "",
        gmail: data.user?.gmail ?? "",
        phone_number: data.user?.phone_number ?? "",
        address: data.user?.address ?? "",
      });
      setMagazines(data.user?.magazines_bought ?? []);
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
          These details stay in the PHP/MySQL backend and will be used for checkout, invoice records, and magazine access.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <ProfileField
            label="Name"
            value={profile.user_name}
            disabled={profileLocked}
            onChange={(value) => setProfile((current) => ({ ...current, user_name: value }))}
          />
          <ProfileField
            label="Gmail"
            type="email"
            value={profile.gmail}
            disabled={profileLocked}
            onChange={(value) => setProfile((current) => ({ ...current, gmail: value }))}
          />
          <ProfileField
            label="Phone Number"
            value={profile.phone_number}
            disabled={profileLocked}
            onChange={(value) => setProfile((current) => ({ ...current, phone_number: value }))}
          />
          <label className="account-field sm:col-span-2">
            <span>Address</span>
            <textarea
              value={profile.address}
              disabled={profileLocked}
              onChange={(event) =>
                setProfile((current) => ({ ...current, address: event.target.value }))
              }
              rows={4}
            />
          </label>
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
            {isComplete ? "Ready for checkout" : "Profile needs details"}
          </p>
          <p className="mt-3 font-plex text-sm leading-7 text-ash">
            {isComplete
              ? "These details are saved and cannot be edited again from this page."
              : "Name, Gmail, phone number, and address are required before payment."}
          </p>
        </div>
        <div className="mt-6 border-t border-steel/50 pt-4">
          <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-fog">
            Bought Magazines
          </p>
          <div className="mt-3 grid gap-3">
            {magazines.length ? (
              magazines.map((magazine) => (
                <div key={`${magazine.id}-${magazine.razorpay_order_id}`} className="account-mini-row">
                  <span>{magazine.title}</span>
                  {magazine.status === "paid" ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-9 rounded-none border border-steel/70 px-3 font-rajdhani text-sm font-bold text-chalk hover:border-ember hover:bg-plate hover:text-chalk"
                      onClick={() => downloadMagazine(magazine)}
                    >
                      <Download className="size-4" />
                      PDF
                    </Button>
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
