import handler from "../../api/send-email";
import { vi } from "vitest";

// Declaramos el mock con vi.hoisted para que exista antes de usarlo
const { mockSend } = vi.hoisted(() => {
  return { mockSend: vi.fn() };
});

// Mock de @aws-sdk/client-ses
vi.mock("@aws-sdk/client-ses", () => {
  return {
    SESClient: vi.fn().mockImplementation(function () {
      return { send: mockSend };
    }),
    SendEmailCommand: vi.fn(),
  };
});

// Helper para simular res
const createMockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("api/send-email handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SES_FROM_EMAIL = "test@example.com";
    process.env.AWS_REGION = "us-east-1";
    process.env.AWS_ACCESS_KEY_ID = "fake";
    process.env.AWS_SECRET_ACCESS_KEY = "fake";
  });

  it("rechaza métodos distintos de POST", async () => {
    const req: any = { method: "GET" };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: "Method Not Allowed" });
  });

  it("devuelve error si faltan parámetros", async () => {
    const req: any = { method: "POST", body: {} };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid email or summary" });
  });

  it("rechaza un email inválido sin llamar a SES", async () => {
    const req: any = { method: "POST", body: { to: "not-an-email", summary: "Hola" } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("rechaza resúmenes demasiado largos", async () => {
    const req: any = { method: "POST", body: { to: "dest@example.com", summary: "x".repeat(10_001) } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("devuelve error si falta SES_FROM_EMAIL", async () => {
    delete process.env.SES_FROM_EMAIL;
    const req: any = { method: "POST", body: { to: "dest@example.com", summary: "Hola" } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Server misconfigured: SES_FROM_EMAIL missing" });
  });

  it("envía email correctamente", async () => {
    mockSend.mockResolvedValueOnce({ MessageId: "123" });
    const req: any = { method: "POST", body: { to: "dest@example.com", summary: "Hola mundo" } };
    const res = createMockRes();

    await handler(req, res);

    expect(mockSend).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      message: "Email enviado correctamente",
      messageId: "123",
    });
  });

  it("maneja error de SES", async () => {
    mockSend.mockRejectedValueOnce({ name: "ServiceError", message: "Falló SES" });
    const req: any = { method: "POST", body: { to: "dest@example.com", summary: "Hola mundo" } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: "EmailDeliveryFailed",
      message: "No se pudo enviar el email",
    });
  });
});