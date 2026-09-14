export const sendEmail = async (to: string, subject: string, body: string) => {
    const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, body }),
    });

    if (!response.ok) {
        throw new Error("Error enviando email");
    }

    return response.json();
};