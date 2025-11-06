export const getUserEmailFromToken = (token) => {
  if (!token) return null;
  try {
    // Tokens have three parts: Header.Payload.Signature
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // Decode the payload part of the token
    const payload = JSON.parse(window.atob(base64));

    // Assuming your backend uses the 'sub' (subject) claim for the email.
    // If your backend uses a different claim (like 'username' or 'email'), update 'sub'.
    return payload.sub;
  } catch (e) {
    console.error("Failed to decode token:", e);
    return null;
  }
};
