import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import fs from "fs";
import path from "path";

const ses = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { to, summary } = req.body ?? {};
  const isValidEmail =
    typeof to === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to);

  if (
    !isValidEmail ||
    typeof summary !== "string" ||
    summary.trim().length === 0 ||
    summary.length > 10_000
  ) {
    return res.status(400).json({ error: "Invalid email or summary" });
  }

  const from = process.env.SES_FROM_EMAIL;
  if (!from) {
    return res
      .status(500)
      .json({ error: "Server misconfigured: SES_FROM_EMAIL missing" });
  }

  try {
    // ✅ Usar process.cwd() para asegurar que encuentra el archivo
    const templatePath = path.join(process.cwd(), "api", "templates", "email-summary.html");
    let htmlBody = fs.readFileSync(templatePath, "utf8");

    // ✅ Reemplazar todas las ocurrencias de {{summary}} con el contenido real
    htmlBody = htmlBody.replace(/{{\s*summary\s*}}/gi, summary);

    const command = new SendEmailCommand({
      Source: from,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: "Tu resumen de tareas - Kairo Tasks" },
        Body: {
          Html: { Data: htmlBody },
          Text: { Data: summary },
        },
      },
    });

    const result = await ses.send(command);
    return res.status(200).json({
      ok: true,
      message: "Email enviado correctamente",
      messageId: result.MessageId,
    });
  } catch (err: any) {
    console.error("SES send error:", err?.name, err?.message);
    return res.status(500).json({
      ok: false,
      error: "EmailDeliveryFailed",
      message: "No se pudo enviar el email",
    });
  }
}