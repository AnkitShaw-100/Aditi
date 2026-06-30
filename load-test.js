import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 50 },
    { duration: "1m", target: 100 },
    { duration: "1m", target: 200 },
    { duration: "1m", target: 300 },
    { duration: "1m", target: 400 },
    { duration: "1m", target: 0 },
  ],
};

const BASE_URL = "http://127.0.0.1:8080";

export default function () {
  const res = http.get(`${BASE_URL}/api/health`);

  check(res, {
    "Health API returned 200": (r) => r.status === 200,
  });

  sleep(1);
}