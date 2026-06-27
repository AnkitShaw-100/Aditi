import { useCallback, useEffect, useMemo, useState } from "react";
import { SignInButton, SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-react";
import { ArrowLeft, CreditCard, Download, Trash2, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { apiRequest, downloadProtectedFile, formatRupees } from "@/lib/api";

export default function CheckoutPage() {
  return (
    <section className="account-page min-h-screen px-4 pb-16 pt-28 md:px-8">
      <div className="mx-auto max-w-5xl">
        <SignedOut>
          <div className="account-panel mx-auto max-w-xl p-6 text-center md:p-8">
            <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
              Cart
            </p>
            <h1 className="mt-3 font-rajdhani text-4xl font-bold leading-none text-chalk">
              Sign in to view your cart.
            </h1>
            <SignInButton mode="modal" forceRedirectUrl="/checkout">
              <Button className="signin-button mt-6 h-11 rounded-none px-8 font-rajdhani text-lg font-bold">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <CheckoutPanel />
        </SignedIn>
      </div>
    </section>
  );
}

function CheckoutPanel() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [cart, setCart] = useState([]);
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("loading");
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [paidPurchases, setPaidPurchases] = useState([]);
  const [message, setMessage] = useState("");

  const loadCheckout = useCallback(async () => {
    setStatus("loading");

    try {
      await apiRequest(getToken, "/api/auth/sync-user", {
        method: "POST",
        body: JSON.stringify({
          user_name: user?.fullName || user?.username,
          gmail: user?.primaryEmailAddress?.emailAddress,
          phone_number: user?.primaryPhoneNumber?.phoneNumber,
        }),
      });

      const [cartData, profileData] = await Promise.all([
        apiRequest(getToken, "/api/cart"),
        apiRequest(getToken, "/api/me"),
      ]);

      setCart(cartData.cart ?? []);
      setProfile(profileData.user ?? null);
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }, [getToken, user]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      loadCheckout();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadCheckout]);

  async function removeItem(cartItemId) {
    try {
      const data = await apiRequest(getToken, `/api/cart/${cartItemId}`, {
        method: "DELETE",
      });
      setCart(data.cart ?? []);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function continueToPayment() {
    setPaymentStatus("creating");
    setMessage("");

    try {
      await loadRazorpayCheckout();
      const data = await apiRequest(getToken, "/api/payments/razorpay/order", {
        method: "POST",
      });

      const options = {
        key: data.key_id,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "ADITI",
        description: "ADITI Strategy & Defence Magazine",
        order_id: data.order.id,
        prefill: {
          name: profile?.user_name ?? user?.fullName ?? "",
          email: profile?.gmail ?? user?.primaryEmailAddress?.emailAddress ?? "",
          contact: profile?.phone_number ?? user?.primaryPhoneNumber?.phoneNumber ?? "",
        },
        notes: {
          address: profile?.address ?? "",
        },
        theme: {
          color: "#c99a4a",
        },
        handler: async (response) => {
          try {
            setPaymentStatus("verifying");
            const verified = await apiRequest(getToken, "/api/payments/razorpay/verify", {
              method: "POST",
              body: JSON.stringify(response),
            });

            setCart([]);
            setPaidPurchases(verified.purchases ?? []);
            setPaymentStatus("paid");
            setMessage("Payment successful. Your magazine is ready to download.");
          } catch (error) {
            setPaymentStatus("error");
            setMessage(error.message);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus("idle");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setPaymentStatus("error");
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

  const totalPaise = useMemo(
    () => cart.reduce((total, item) => total + Number(item.price_paise || 0), 0),
    [cart]
  );

  const profileComplete = Boolean(
    profile?.user_name && profile?.gmail && profile?.phone_number && profile?.address
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
      <div className="account-panel p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
              Checkout
            </p>
            <h1 className="mt-3 font-rajdhani text-[clamp(2.2rem,7vw,4.2rem)] font-bold leading-none text-chalk">
              Your cart.
            </h1>
          </div>
          <Button
            asChild
            variant="ghost"
            className="h-10 rounded-none border border-steel/70 px-4 font-rajdhani text-base font-bold text-chalk hover:border-ember hover:bg-plate hover:text-chalk"
          >
            <Link to="/#read">
              <ArrowLeft className="size-4" />
              Browse
            </Link>
          </Button>
        </div>

        <div className="mt-7 grid gap-3">
          {status === "loading" ? (
            <p className="font-plex text-sm text-ash">Loading cart...</p>
          ) : cart.length ? (
            cart.map((item) => (
              <article key={item.cart_item_id} className="cart-row">
                <div>
                  <p className="font-rajdhani text-xl font-bold leading-tight text-chalk">
                    {item.title}
                  </p>
                  <p className="mt-1 font-plex text-xs uppercase tracking-[0.16em] text-fog">
                    {item.sku}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-rajdhani text-xl font-bold text-ember">
                    {formatRupees(item.price_paise)}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none border border-steel/60 text-fog hover:border-ember hover:bg-plate hover:text-chalk"
                    aria-label={`Remove ${item.title}`}
                    onClick={() => removeItem(item.cart_item_id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </article>
            ))
          ) : (
            <p className="font-plex text-sm leading-7 text-ash">
              Your cart is empty. Add a premium dispatch from the articles section.
            </p>
          )}
          {message ? <p className="font-plex text-sm text-ember">{message}</p> : null}
        </div>
      </div>

      <aside className="account-panel p-5 md:p-7">
        <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
          Payment Summary
        </p>
        <div className="mt-5 grid gap-3 border-t border-steel/50 pt-5">
          <div className="account-mini-row">
            <span>Items</span>
            <b>{cart.length}</b>
          </div>
          <div className="account-mini-row">
            <span>Total</span>
            <b>{formatRupees(totalPaise)}</b>
          </div>
        </div>

        {!profileComplete ? (
          <div className="mt-5 border border-ember/40 bg-ember/10 p-4">
            <p className="font-rajdhani text-xl font-bold text-chalk">
              Complete profile first
            </p>
            <p className="mt-2 font-plex text-sm leading-6 text-ash">
              Phone number and address are needed before payment and invoice generation.
            </p>
            <Button
              asChild
              variant="ghost"
              className="mt-4 h-10 rounded-none border border-ember/50 px-4 font-rajdhani text-base font-bold text-chalk hover:bg-plate hover:text-chalk"
            >
              <Link to="/profile">
                <UserRound className="size-4" />
                Open Profile
              </Link>
            </Button>
          </div>
        ) : null}

        <Button
          type="button"
          disabled={!cart.length || !profileComplete || paymentStatus === "creating" || paymentStatus === "verifying"}
          onClick={continueToPayment}
          className="final-button mt-5 h-11 w-full rounded-none px-6 font-rajdhani text-base font-bold"
        >
          <CreditCard className="size-4" />
          {paymentStatus === "creating"
            ? "Creating Order"
            : paymentStatus === "verifying"
              ? "Verifying"
              : "Continue to Payment"}
        </Button>
        <p className="mt-3 font-plex text-xs leading-5 text-fog">
          Secure payment opens through Razorpay. After successful verification, the PDF download appears here and in your profile.
        </p>

        {paidPurchases.length ? (
          <div className="mt-5 border-t border-steel/50 pt-5">
            <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
              Ready to Download
            </p>
            <div className="mt-3 grid gap-3">
              {paidPurchases.map((magazine) => (
                <Button
                  key={`${magazine.slug}-${magazine.razorpay_order_id}`}
                  type="button"
                  variant="ghost"
                  className="h-auto justify-between rounded-none border border-steel/70 px-4 py-3 text-left font-rajdhani text-base font-bold text-chalk hover:border-ember hover:bg-plate hover:text-chalk"
                  onClick={() => downloadMagazine(magazine)}
                >
                  <span>{magazine.title}</span>
                  <Download className="size-4" />
                </Button>
              ))}
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function loadRazorpayCheckout() {
  if (window.Razorpay) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');

    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", () => reject(new Error("Unable to load Razorpay Checkout.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Unable to load Razorpay Checkout."));
    document.body.appendChild(script);
  });
}
