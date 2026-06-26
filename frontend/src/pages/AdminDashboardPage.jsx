import { useCallback, useEffect, useMemo, useState } from "react";
import { LogOut, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { API_BASE_URL, formatRupees } from "@/lib/api";
import { ADMIN_TOKEN_KEY } from "@/pages/AdminLoginPage";

const USERS_PER_PAGE = 7;

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const totals = useMemo(
    () => ({
      users: users.length,
      carts: users.reduce((total, user) => total + (user.cart_items?.length ?? 0), 0),
      purchases: users.reduce((total, user) => total + (user.magazines_bought?.length ?? 0), 0),
    }),
    [users]
  );

  const pageCount = Math.max(1, Math.ceil(users.length / USERS_PER_PAGE));
  const activePage = Math.min(currentPage, pageCount);
  const paginatedUsers = useMemo(() => {
    const start = (activePage - 1) * USERS_PER_PAGE;

    return users.slice(start, start + USERS_PER_PAGE);
  }, [activePage, users]);

  const loadUsers = useCallback(async () => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);

    if (!token) {
      navigate("/admin/login");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        navigate("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to load users");
      }

      setUsers(data.users ?? []);
      setCurrentPage(1);
      setStatus("ready");
    } catch (error) {
      setMessage(error.message);
      setStatus("error");
    }
  }, [navigate]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      loadUsers();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadUsers]);

  async function logout() {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);

    if (token) {
      await fetch(`${API_BASE_URL}/api/admin/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }

    localStorage.removeItem(ADMIN_TOKEN_KEY);
    navigate("/admin/login");
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
                User data.
              </h1>
              <p className="mt-4 max-w-2xl font-plex text-sm leading-7 text-ash">
                View synced Clerk users, profile details, cart items, and purchased magazines from MySQL.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                className="h-10 rounded-none border border-steel/70 px-4 font-rajdhani text-base font-bold text-chalk hover:border-ember hover:bg-plate hover:text-chalk"
                onClick={loadUsers}
              >
                <RefreshCw className="size-4" />
                Refresh
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

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            <AdminStat label="Users" value={totals.users} />
            <AdminStat label="Cart Items" value={totals.carts} />
            <AdminStat label="Purchases" value={totals.purchases} />
          </div>

          <div className="mt-7 overflow-x-auto">
            {status === "loading" ? (
              <p className="font-plex text-sm text-ash">Loading users...</p>
            ) : users.length ? (
              <table className="admin-table w-full min-w-[64rem]">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Cart</th>
                    <th>Bought</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <b>{user.user_name || "Unnamed"}</b>
                        <span>{user.clerk_user_id}</span>
                      </td>
                      <td>
                        <b>{user.gmail || "No email"}</b>
                        <span>{user.phone_number || "No phone"}</span>
                      </td>
                      <td>{user.address || "No address"}</td>
                      <td>
                        <AdminList
                          empty="No cart"
                          items={user.cart_items}
                          renderItem={(item) => `${item.title} (${formatRupees(item.price_paise)})`}
                        />
                      </td>
                      <td>
                        <AdminList
                          empty="No purchases"
                          items={user.magazines_bought}
                          renderItem={(item) => `${item.title} - ${item.status}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="font-plex text-sm text-ash">No users found.</p>
            )}
            {message ? <p className="mt-4 font-plex text-sm text-ember">{message}</p> : null}
          </div>

          {users.length > USERS_PER_PAGE ? (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-steel/50 pt-5">
              <p className="font-plex text-sm text-ash">
                Showing {(activePage - 1) * USERS_PER_PAGE + 1}-
                {Math.min(activePage * USERS_PER_PAGE, users.length)} of {users.length} users
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={activePage === 1}
                  className="h-10 rounded-none border border-steel/70 px-4 font-rajdhani text-base font-bold text-chalk hover:border-ember hover:bg-plate hover:text-chalk disabled:opacity-40"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                >
                  Previous
                </Button>
                <span className="min-w-20 text-center font-plex text-sm text-fog">
                  {activePage} / {pageCount}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={activePage === pageCount}
                  className="h-10 rounded-none border border-steel/70 px-4 font-rajdhani text-base font-bold text-chalk hover:border-ember hover:bg-plate hover:text-chalk disabled:opacity-40"
                  onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
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

function AdminList({ items = [], empty, renderItem }) {
  if (!items.length) {
    return <span>{empty}</span>;
  }

  return (
    <ul className="grid gap-1">
      {items.map((item, index) => (
        <li key={`${item.id ?? item.cart_item_id ?? item.purchase_id}-${index}`}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}
