import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define route matchers for protected and public routes
const isProtectedRoute = createRouteMatcher(["/servers(.*)", "/invite(.*)"]);
const isPublicRoute = createRouteMatcher(["/api/uploadthing(.*)"]);

// Define the clerkMiddleware to handle authentication
export default clerkMiddleware((auth, req) => {
  // Check if the current request is for a public route and if the user is authenticated
  if (isPublicRoute(req) && auth().userId) {
    // TODO: Add your redirection logic here if needed
  }

  // Protect protected routes using Clerk authentication
  if (isProtectedRoute(req)) {
    // If the request matches a protected route, enforce authentication
    auth().protect();
  }
});

// Configure the middleware to run on specific routes
export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Exclude static files from being processed by the middleware
    "/", // Include the index page
    "/(api|trpc)(.*)", // Include API and trpc routes
  ],
};
