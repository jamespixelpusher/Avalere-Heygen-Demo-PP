const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export async function POST() {
  try {
    if (!HEYGEN_API_KEY) {
      return new Response("API key is not configured", {
        status: 500,
      });
    }

    if (!BASE_API_URL) {
      return new Response("Base API URL is not configured", {
        status: 500,
      });
    }

    const res = await fetch(`${BASE_API_URL}/v1/streaming.create_token`, {
      method: "POST",
      headers: {
        "x-api-key": HEYGEN_API_KEY,
      },
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("HeyGen API error:", errorData);
      return new Response("Failed to create token", {
        status: res.status,
      });
    }

    const data = await res.json();

    if (!data.data?.token) {
      console.error("Invalid token response:", data);
      return new Response("Invalid token response", {
        status: 500,
      });
    }

    return new Response(data.data.token, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return new Response("Internal server error", {
      status: 500,
    });
  }
}
