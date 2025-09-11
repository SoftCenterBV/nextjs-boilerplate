"use server";

export async function registerUser(formData: {
    email: string;
    password: string;
    password_confirmation: string;
}) {
    const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
    }

    return res.json();
}
