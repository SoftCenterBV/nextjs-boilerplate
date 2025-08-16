// @ts-ignore
import  { ofetch } from "ofetch";
export const apiClient =  ofetch.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
    },
    onResponseError({response}) {
        if (response.status === 401) {
            // Handle unauthorized access, e.g., redirect to login
            console.error("Unauthorized access - redirecting to login");
        } else if (response.status >= 400) {
            // Handle other errors
            console.error("API error:", response.statusText);
        }
    },
    onResponse({response}) {
        // Optionally, you can log the response or perform other actions
        console.log("API response:", response);
    }
});
}