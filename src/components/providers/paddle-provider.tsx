"use client";

import Script from "next/script";

export function PaddleProvider() {
  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const env = process.env.NEXT_PUBLIC_PADDLE_ENV ?? "sandbox";

  return (
    <Script
      src="https://cdn.paddle.com/paddle/v2/paddle.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window !== "undefined" && (window as any).Paddle) {
          const P = (window as any).Paddle;
          if (env === "sandbox") {
            P.Environment.set("sandbox");
          }
          P.Initialize({ token: clientToken });
        }
      }}
    />
  );
}
