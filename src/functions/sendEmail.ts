import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Configuración del cliente SES con credenciales seguras en variables de entorno
const sesClient = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
        return res.status(400).json({ error: "Faltan parámetros" });
    }

    try {
        const command = new SendEmailCommand({
            Destination: { ToAddresses: [to] },
            Message: {
                Body: { Text: { Data: body } },
                Subject: { Data: subject },
            },
            Source: process.env.AWS_SES_SOURCE_EMAIL!, // Email verificado en SES
        });

        await sesClient.send(command);

        return res.status(200).json({ success: true, message: "Email enviado correctamente" });
    } catch (error) {
        console.error("Error enviando email:", error);
        return res.status(500).json({ error: "Error al enviar email" });
    }
}