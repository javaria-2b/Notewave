import "server-only";

import { StackServerApp } from "@stackframe/stack";

// Configure Stack with Redis for production
export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  // Use environment variables for production configuration
  // The Stack framework will handle user data storage internally
});
