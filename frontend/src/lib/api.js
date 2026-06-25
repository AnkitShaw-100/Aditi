export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";

export async function apiRequest(getToken, path, options = {}) {
  const token = await getToken();

  if (!token) {
    throw new Error("Missing Clerk token");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
}

export function formatRupees(pricePaise) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format((Number(pricePaise) || 0) / 100);
}

