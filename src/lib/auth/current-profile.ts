import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/src/lib/database/db";

export const currentProfile = async () => {
  // Get the current user
  const user = await currentUser();

  // If no user is found, redirect to sign-in page
  if (!user) auth().redirectToSignIn();

  // Check if a profile already exists for the user
  const profile = await db.profile.findUnique({
    where: { userId: user!.id },
  });

  // If profile exists, return it
  if (profile) return profile;

  // If no profile exists, create a new one and return the newly created profile
  return db.profile.create({
    data: {
      userId: user!.id, // Set user ID
      name: `${user?.firstName} ${user?.lastName}`, // Combine first and last name for full name
      imageUrl: user!.imageUrl, // Set user image URL
      email: user?.emailAddresses[0].emailAddress!, // Set user email
    },
  });
};
