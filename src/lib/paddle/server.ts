import { Paddle } from "@paddle/paddle-node-sdk";

// Server-side Paddle SDK — never expose this to the client
export function getPaddleClient() {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing PADDLE_API_KEY environment variable");
  }
  return new Paddle(apiKey);
}
