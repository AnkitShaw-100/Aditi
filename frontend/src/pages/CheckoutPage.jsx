import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { SignInButton, SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-react";
import { CreditCard, Trash2, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { apiRequest, formatRupees } from "@/lib/api";

export default function CheckoutPage() {
  useLayoutEffect(() => {
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
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("loading");
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const loadCheckout = useCallback(async () => {
    setStatus("loading");

    try {
      await apiRequest(getToken, "/api/auth/sync-user", {
        method: "POST",
        body: JSON.stringify({
          username: user?.fullName || user?.username,
          email: user?.primaryEmailAddress?.emailAddress,
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
          name: profile?.username ?? user?.fullName ?? "",
          email: profile?.email ?? user?.primaryEmailAddress?.emailAddress ?? "",
          contact: profile?.phone_number ?? user?.primaryPhoneNumber?.phoneNumber ?? "",
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
            setPaymentStatus("paid");
            window.sessionStorage.setItem(
              "aditi:last-paid-order",
              JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                purchases: verified.purchases ?? [],
              })
            );
            navigate(`/payment-success?order=${encodeURIComponent(response.razorpay_order_id)}`, {
              replace: true,
              state: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                purchases: verified.purchases ?? [],
              },
            });
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

  const totalPaise = useMemo(
    () => cart.reduce((total, item) => total + Number(item.price_paise || 0), 0),
    [cart]
  );

  const profileComplete = Boolean(
    profile?.username &&
      profile?.email &&
      profile?.phone_number &&
      profile?.dob &&
      profile?.profile_completed_at
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
        </div>

        <div className="mt-7 grid gap-3">
          {status === "loading" ? (
            <p className="font-plex text-sm text-ash">Loading cart...</p>
          ) : cart.length ? (
            cart.map((item) => (
              <article key={item.cart_item_id} className="cart-row">
                <div className="cart-row-copy">
                  <p className="cart-row-title font-rajdhani text-xl font-bold leading-tight text-chalk">
                    {item.title}
                  </p>
                  <p className="cart-row-sku mt-1 font-plex text-xs uppercase tracking-[0.16em] text-fog">
                    {item.sku}
                  </p>
                </div>
                <div className="cart-row-actions">
                  <span className="cart-row-price font-rajdhani text-xl font-bold text-ember">
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
              Save your profile with phone number and date of birth before payment and receipt email generation.
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
          className="final-button checkout-pay-button mt-5 h-11 w-full rounded-none px-6 font-rajdhani text-base font-bold"
        >
          <CreditCard className="size-4" />
          {paymentStatus === "creating"
            ? "Creating Order"
            : paymentStatus === "verifying"
              ? "Verifying"
              : "Continue to Payment"}
        </Button>
        <p className="mt-3 font-plex text-xs leading-5 text-fog">
          Secure payment opens through Razorpay. After successful verification, you will be taken to your download page and the receipt will be emailed.
        </p>
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
