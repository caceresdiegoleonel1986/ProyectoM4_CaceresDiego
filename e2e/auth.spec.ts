import { expect, test } from "@playwright/test";

test.describe("Autenticación en el navegador", () => {
    test("redirige una ruta protegida al login", async ({ page }) => {
        await page.goto("/tasks");

        await expect(page).toHaveURL(/\/login$/);
        await expect(page.getByRole("heading", { name: "Bienvenido de nuevo" })).toBeVisible();
    });

    test("muestra registro con Google y valida una contraseña corta", async ({ page }) => {
        await page.goto("/register");

        await expect(page.getByRole("button", { name: "Registrarse con Google" })).toBeVisible();
        await page.getByLabel("Correo Electrónico").fill("e2e@example.com");
        await page.getByLabel(/Contraseña/).fill("12345");
        await page.getByRole("button", { name: "Crear Cuenta" }).click();

        await expect(
            page.getByText("La contraseña debe tener al menos 6 caracteres.")
        ).toBeVisible();
    });
});
