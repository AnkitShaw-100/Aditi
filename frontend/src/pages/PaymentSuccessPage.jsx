import { useCallback, useEffect, useMemo, useState } from "react";
import { SignInButton, SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { ArrowRight, Download, Home } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { apiRequest, downloadProtectedFile, formatRupees } from "@/lib/api";

const REDIRECT_SECONDS = 45;

export default function PaymentSuccessPage() {
  const location = useLocation();
  const redirectUrl = `/payment-success${location.search}`;

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="account-page min-h-screen px-4 pb-16 pt-28 md:px-8">
      <div className="mx-auto max-w-5xl">
        <SignedOut>
          <div className="account-panel mx-auto max-w-xl p-6 text-center md:p-8">
            <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
              Payment Complete
            </p>
            <h1 className="mt-3 font-rajdhani text-4xl font-bold leading-none text-chalk">
              Sign in to open your downloads.
            </h1>
            <p className="mt-4 font-plex text-sm leading-7 text-ash">
              Your paid magazine is attached to your ADITI account.
            </p>
            <SignInButton mode="modal" forceRedirectUrl={redirectUrl}>
              <Button className="signin-button mt-6 h-11 rounded-none px-8 font-rajdhani text-lg font-bold">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <PaymentSuccessPanel />
        </SignedIn>
      </div>
    </section>
  );
}

function PaymentSuccessPanel() {
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  const savedOrder = useMemo(() => {
    try {
      return JSON.parse(window.sessionStorage.getItem("aditi:last-paid-order") || "{}");
    } catch {
      return {};
    }
  }, []);

  const orderId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("order") || location.state?.orderId || savedOrder?.orderId || "";
  }, [location.search, location.state, savedOrder]);

  useEffect(() => {
    const redirectTimer = window.setTimeout(() => {
      navigate("/", { replace: true });
    }, REDIRECT_SECONDS * 1000);
    const countdownTimer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      window.clearTimeout(redirectTimer);
      window.clearInterval(countdownTimer);
    };
  }, [navigate]);

  useEffect(() => {
    let active = true;

    async function loadPurchases() {
      try {
        const data = await apiRequest(getToken, "/api/me");

        if (!active) return;

        setProfile(data.user ?? null);
        setStatus("ready");
      } catch (error) {
        if (!active) return;
        setStatus("error");
        setMessage(error.message);
      }
    }

    loadPurchases();

    return () => {
      active = false;
    };
  }, [getToken]);

  const purchases = useMemo(() => {
    const profilePurchases = profile?.magazines_bought ?? [];
    const statePurchases = location.state?.purchases ?? savedOrder?.purchases ?? [];
    const source = profilePurchases.length ? profilePurchases : statePurchases;
    const paidPurchases = source.filter((purchase) => purchase.status === "paid" || !purchase.status);

    if (!orderId) {
      return paidPurchases;
    }

    return paidPurchases.filter((purchase) => purchase.razorpay_order_id === orderId);
  }, [location.state, orderId, profile, savedOrder]);

  const totalPaise = useMemo(
    () => purchases.reduce((total, purchase) => total + Number(purchase.price_paise || 0), 0),
    [purchases]
  );

  const downloadMagazine = useCallback(
    async (magazine) => {
      try {
        await downloadProtectedFile(
          getToken,
          `/api/magazines/${encodeURIComponent(magazine.slug)}/download`,
          `${magazine.slug}.pdf`
        );
      } catch (error) {
        setMessage(error.message);
      }
    },
    [getToken]
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
      <div className="account-panel payment-success-hero p-5 md:p-8">
        <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
          Thank You
        </p>
        <h1 className="mt-3 font-rajdhani text-[clamp(2.35rem,8vw,5rem)] font-bold leading-none text-chalk">
          Payment confirmed.
        </h1>
        <p className="mt-4 max-w-2xl font-plex text-sm leading-7 text-ash md:text-base">
          Your ADITI Strategy & Defence Magazine is ready. The invoice and receipt have been sent to your registered email.
        </p>

        <div className="payment-notice mt-7">
          <p className="font-plex text-xs font-semibold uppercase tracking-[0.18em] text-ember">
            Notice
          </p>
          <p className="mt-2 font-rajdhani text-2xl font-bold leading-tight text-chalk">
            The new edition will be out by 8 July 2026.
          </p>
          <p className="mt-2 font-plex text-sm leading-6 text-ash">
            This thank-you page will redirect you to the home page in {secondsLeft} seconds.
          </p>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Button
            asChild
            className="final-button h-11 rounded-none px-6 font-rajdhani text-base font-bold"
          >
            <Link to="/">
              <Home className="size-4" />
              Home
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="h-11 rounded-none border border-steel/70 px-5 font-rajdhani text-base font-bold text-chalk hover:border-ember hover:bg-plate hover:text-chalk"
          >
            <Link to="/profile">
              Profile
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <aside className="account-panel p-5 md:p-7">
        <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
          Ready to Download
        </p>
        <div className="mt-5 grid gap-3 border-t border-steel/50 pt-5">
          <div className="account-mini-row">
            <span>Order</span>
            <b>{orderId || "Latest"}</b>
          </div>
          <div className="account-mini-row">
            <span>Total</span>
            <b>{formatRupees(totalPaise)}</b>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {status === "loading" ? (
            <p className="font-plex text-sm text-ash">Preparing downloads...</p>
          ) : purchases.length ? (
            purchases.map((magazine) => (
              <Button
                key={`${magazine.slug}-${magazine.razorpay_order_id}`}
                type="button"
                variant="ghost"
                className="download-action h-auto w-full rounded-none border border-steel/70 px-4 py-3 text-left font-rajdhani text-base font-bold text-chalk hover:border-ember hover:bg-plate hover:text-chalk"
                onClick={() => downloadMagazine(magazine)}
              >
                <span>{magazine.title}</span>
                <Download className="size-4" />
              </Button>
            ))
          ) : (
            <p className="font-plex text-sm leading-6 text-ash">
              No paid magazine was found for this order yet. Your profile will show every paid issue once the payment record is ready.
            </p>
          )}
        </div>

        {message ? <p className="mt-4 font-plex text-sm text-ember">{message}</p> : null}
      </aside>
    </div>
  );
}
