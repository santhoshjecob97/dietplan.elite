/**
 * Step2 Fitness — Google Fit Integration
 * --------------------------------------
 * Handles OAuth2 authentication and REST API calls to fetch data.
 */

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const SCOPES = "https://www.googleapis.com/auth/fitness.activity.read";

export const connectGoogleFit = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "PASTE_YOUR_ID_HERE";
  const redirectUri = window.location.origin;
  const url = `${GOOGLE_AUTH_ENDPOINT}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${encodeURIComponent(SCOPES)}`;
  window.location.href = url;
};

export const fetchTodaySteps = async (accessToken) => {
  if (!accessToken) return null;
  
  const now = new Date();
  const startTimeMillis = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endTimeMillis = now.getTime();

  try {
    const response = await fetch("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        aggregateBy: [{ dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps" }],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis,
        endTimeMillis
      })
    });

    const data = await response.json();
    const steps = data?.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
    return steps;
  } catch (error) {
    console.error("Google Fit Fetch Error:", error);
    return null;
  }
};
