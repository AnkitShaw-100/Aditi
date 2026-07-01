import { useCallback, useEffect, useMemo, useState } from "react";
import { CreditCard, LogOut, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { API_BASE_URL, formatRupees } from "@/lib/api";
import { ADMIN_ENTRY_PATH } from "@/lib/adminRoutes";

const LEGACY_ADMIN_TOKEN_KEY = "aditi_admin_token";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [paymentOrders, setPaymentOrders] = useState([]);
  const [status, setStatus] = useState("loading");
  const [recoveringOrderId, setRecoveringOrderId] = useState("");
  const [message, setMessage] = useState("");

  const totals = useMemo(
    () => ({
      users: users.length,
      carts: users.reduce((total, user) => total + (user.cart_items?.length ?? 0), 0),
      purchases: users.reduce((total, user) => total + (user.magazines_bought?.length ?? 0), 0),
      pendingPayments: paymentOrders.filter((order) => order.status === "pending").length,
    }),
    [paymentOrders, users]
  );

  const loadDashboard = useCallback(async () => {
    setStatus("loading");
    setMessage("");

    try {
      const [usersResponse, paymentsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/users`, {
          credentials: "include",
        }),
        fetch(`${API_BASE_URL}/api/admin/payments`, {
          credentials: "include",
        }),
      ]);
      const data = await usersResponse.json();

      if (usersResponse.status === 401 || paymentsResponse.status === 401) {
        navigate(ADMIN_ENTRY_PATH);
        return;
      }

      if (!usersResponse.ok) {
        throw new Error(data.error || "Unable to load dashboard");
      }

      setUsers(data.users ?? []);

      if (paymentsResponse.ok) {
        const paymentData = await paymentsResponse.json();
        setPaymentOrders(paymentData.orders ?? []);
      } else {
        setPaymentOrders([]);
        setMessage("Users loaded, but payment operations could not load. Run the latest migrations.");
      }

      setStatus("ready");
    } catch (error) {
      setMessage(error.message);
      setStatus("error");
    }
  }, [navigate]);

  async function recoverPayment(order) {
    setRecoveringOrderId(order.razorpay_order_id);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/payments/recover`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ razorpay_order_id: order.razorpay_order_id }),
      });
      const data = await response.json();

      if (response.status === 401) {
        navigate(ADMIN_ENTRY_PATH);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to refresh payment");
      }

      setPaymentOrders(data.orders ?? []);
      setMessage(data.message || "Payment status refreshed.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setRecoveringOrderId("");
    }
  }

  useEffect(() => {
    localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);

    const timerId = window.setTimeout(() => {
      loadDashboard();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadDashboard]);

  async function logout() {
    await fetch(`${API_BASE_URL}/api/admin/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
    navigate(ADMIN_ENTRY_PATH);
  }

  return (
    <section className="account-page min-h-screen px-4 pb-16 pt-28 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="account-panel p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
                Admin Dashboard
              </p>
              <h1 className="mt-3 font-rajdhani text-[clamp(2.2rem,7vw,4.6rem)] font-bold leading-none text-chalk">
                Payment operations.
              </h1>
              <p className="mt-4 max-w-2xl font-plex text-sm leading-7 text-ash">
                Review Razorpay orders, receipt email status, and recover paid orders that did not unlock cleanly.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                disabled={status === "loading"}
                className="h-10 rounded-none border border-steel/70 px-4 font-rajdhani text-base font-bold text-chalk hover:border-ember hover:bg-plate hover:text-chalk disabled:opacity-40"
                onClick={loadDashboard}
              >
                <RefreshCw className="size-4" />
                {status === "loading" ? "Refreshing" : "Refresh"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-10 rounded-none border border-steel/70 px-4 font-rajdhani text-base font-bold text-chalk hover:border-ember hover:bg-plate hover:text-chalk"
                onClick={logout}
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </div>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-4">
            <AdminStat label="Users" value={totals.users} />
            <AdminStat label="Cart Items" value={totals.carts} />
            <AdminStat label="Purchases" value={totals.purchases} />
            <AdminStat label="Pending Payments" value={totals.pendingPayments} />
          </div>

          <div className="mt-7 border-t border-steel/50 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
                  Payment Operations
                </p>
                <p className="mt-2 font-plex text-sm leading-6 text-ash">
                  One table for payment status, PDF access recovery, and receipt email tracking.
                </p>
              </div>
              <CreditCard className="size-5 text-ember" />
            </div>

            <div className="mt-4 overflow-x-auto">
              {paymentOrders.length ? (
                <table className="admin-table w-full min-w-[72rem]">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Order</th>
                      <th>Magazine</th>
                      <th>Status</th>
                      <th>Receipt Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentOrders.map((order) => (
                      <tr key={`${order.user_id}-${order.razorpay_order_id}`}>
                        <td>
                          <b>{order.username || "Unnamed"}</b>
                          <span>{order.email || "No email"}</span>
                          <span>{order.phone_number || "No phone"}</span>
                        </td>
                        <td>
                          <b>{order.razorpay_order_id}</b>
                          <span>{order.razorpay_payment_id || "No payment id"}</span>
                        </td>
                        <td>
                          <b>{order.magazine_titles || "Magazine"}</b>
                          <span>
                            {order.item_count || 1} item - {formatRupees(order.amount_paise || 0)}
                          </span>
                        </td>
                        <td>
                          <b>{order.status}</b>
                          <span>{order.purchased_at || order.updated_at || "No date"}</span>
                        </td>
                        <td>
                          <b>{order.receipt_number || "No receipt yet"}</b>
                          <span>
                            {order.email_sent_at
                              ? `Sent ${order.email_sent_at}`
                              : order.email_last_error
                                ? `Failed: ${order.email_last_error}`
                                : "Not sent yet"}
                          </span>
                        </td>
                        <td>
                          <Button
                            type="button"
                            variant="ghost"
                            disabled={recoveringOrderId === order.razorpay_order_id}
                            className="h-10 rounded-none border border-steel/70 px-4 font-rajdhani text-base font-bold text-chalk hover:border-ember hover:bg-plate hover:text-chalk disabled:opacity-40"
                            onClick={() => recoverPayment(order)}
                          >
                            <RefreshCw className="size-4" />
                            {recoveringOrderId === order.razorpay_order_id
                              ? "Checking"
                              : order.status === "pending"
                                ? "Recover"
                                : "Refresh"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="font-plex text-sm text-ash">
                  {status === "loading" ? "Loading payments..." : "No Razorpay orders found yet."}
                </p>
              )}
            </div>

            {message ? <p className="mt-4 font-plex text-sm text-ember">{message}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminStat({ label, value }) {
  return (
    <div className="account-mini-row">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
