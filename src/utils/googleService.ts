import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

interface Payload {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  sub: string;
}

export const googleVerify = async (
  idToken: string
): Promise<{ name: string; email: string; picture: string; sub: string }> => {
  console.log("Google Client ID:", process.env.CLIENT_ID);
  console.log("Received ID Token:", idToken);

  const client = new OAuth2Client(process.env.CLIENT_ID);

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });

    if (!ticket) {
      throw new Error("Failed to verify ID Token. Ticket is undefined.");
    }

    const payload = ticket.getPayload() as Payload | null;

    if (!payload) {
      throw new Error("Invalid ID Token: Payload is undefined.");
    }

    const { email, email_verified, name, picture, sub } = payload;

    if (!email_verified) {
      console.error("Email is not verified:", email);
      throw new Error("Email not verified by Google.");
    }

    console.log("Google Verification Successful. User Info:", {
      email,
      name,
      picture,
      sub,
    });

    return { email, name, picture, sub };
  } catch (error) {
    console.error("Error during Google verification:", error);
    throw new Error("Google verification failed.");
  }
};
