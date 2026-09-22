import { expect, test } from "@playwright/test";

// Requiere una cuenta real de prueba en Firebase Auth para iniciar sesión.
// Se omite automáticamente si no se configuran las credenciales.
const TEST_EMAIL = process.env.E2E_TEST_EMAIL;
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD;

test.describe("CRUD de tareas autenticado", () => {
    test.skip(!TEST_EMAIL || !TEST_PASSWORD, "Configura E2E_TEST_EMAIL y E2E_TEST_PASSWORD para ejecutar este flujo.");

    test.beforeEach(async ({ page }) => {
        await page.goto("/login");
        await page.getByLabel("Correo Electrónico").fill(TEST_EMAIL!);
        await page.getByLabel("Contraseña").fill(TEST_PASSWORD!);
        await page.getByRole("button", { name: "Iniciar Sesión" }).click();
        await expect(page).toHaveURL(/\/tasks$/);
    });

    test("crea, completa y elimina una tarea", async ({ page }) => {
        const title = `Tarea E2E ${Date.now()}`;

        await page.getByPlaceholder("Título de la tarea...").fill(title);
        await page.getByRole("button", { name: /Agregar tarea/ }).click();

        const taskItem = page.locator(".task-item", { hasText: title });
        await expect(taskItem).toBeVisible();

        await taskItem.getByTitle("Marcar como completada").click();
        await expect(taskItem).toHaveClass(/completed/);

        await taskItem.getByRole("button", { name: "Eliminar tarea" }).click();
        await expect(page.locator(".task-item", { hasText: title })).toHaveCount(0);
    });
});
