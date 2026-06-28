import { apiRequest } from "@/lib/api";

export async function addMagazineToCart({ getToken, user, magazineSlug }) {
  if (!magazineSlug) {
    throw new Error("Magazine is missing.");
  }

  await apiRequest(getToken, "/api/auth/sync-user", {
    method: "POST",
    body: JSON.stringify({
      username: user?.fullName || user?.username,
      email: user?.primaryEmailAddress?.emailAddress,
      phone_number: user?.primaryPhoneNumber?.phoneNumber,
    }),
  });

  return apiRequest(getToken, "/api/cart", {
    method: "POST",
    body: JSON.stringify({ magazine_slug: magazineSlug }),
  });
}
