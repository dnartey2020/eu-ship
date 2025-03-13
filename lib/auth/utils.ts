// lib/auth.js
export const signin = async (data) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

  try {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json", // Explicitly request JSON
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle HTTP errors
    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      let errorMessage = `Login failed (${res.status} ${res.statusText})`;

      // Handle JSON error responses
      if (contentType?.includes("application/json")) {
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.error("JSON parse error:", jsonError);
        }
      }
      // Handle non-JSON error responses
      else {
        try {
          const text = await res.text();
          if (text) errorMessage += `: ${text.substring(0, 100)}`; // Limit text length
        } catch (textError) {
          console.error("Text read error:", textError);
        }
      }

      throw new Error(errorMessage);
    }

    // Handle successful response
    try {
      const responseData = await res.json();

      // Validate successful response structure
      if (!responseData.user || !responseData.token) {
        throw new Error("Invalid server response structure");
      }

      return responseData;
    } catch (parseError) {
      throw new Error(
        "Failed to parse successful response: " + parseError.message,
      );
    }
  } catch (err) {
    clearTimeout(timeoutId);

    // Handle specific error types
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    if (err instanceof SyntaxError) {
      throw new Error("Invalid server response format");
    }

    // Propagate existing error messages
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Unknown authentication error");
  }
};

export const signup = async (data) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json", // Explicitly request JSON
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorMessage = `Registration failed (${res.status})`;
      const contentType = res.headers.get("content-type");

      try {
        // Handle JSON error responses
        if (contentType?.includes("application/json")) {
          const errorData = await res.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        }
        // Handle HTML/text error responses
        else {
          const text = await res.text();
          errorMessage += `: ${text.substring(0, 100)}`; // Truncate long text
        }
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
        errorMessage += ` - ${res.statusText}`;
      }

      throw new Error(errorMessage);
    }

    // Handle successful response
    try {
      const responseData = await res.json();

      // Validate response structure
      if (!responseData.user || !responseData.user.id) {
        throw new Error("Invalid server response structure");
      }

      return responseData;
    } catch (parseError) {
      throw new Error(
        "Failed to parse successful response: " + parseError.message,
      );
    }
  } catch (err) {
    clearTimeout(timeoutId);

    // Handle specific error types
    if (err.name === "AbortError") {
      throw new Error("Registration request timed out");
    }

    if (err instanceof SyntaxError) {
      throw new Error("Invalid server response format");
    }

    // Propagate existing errors
    throw err;
  }
};
