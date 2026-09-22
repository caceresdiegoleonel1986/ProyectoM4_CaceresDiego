import { render, screen, act } from "@testing-library/react";
import { vi } from "vitest";
import React from "react";
import { AuthProvider, useAuth } from "../hooks/useAuth";
import type { User } from "firebase/auth";

// Mock de firebase/auth
vi.mock("firebase/auth", () => {
  return {
    getAuth: vi.fn(() => ({})),

    onAuthStateChanged: vi.fn((auth, callback) => {
      // simula usuario logueado
      callback({ uid: "123", email: "test@example.com" } as User);
      return () => { };
    }),
    signOut: vi.fn(() => Promise.resolve()),
    signInWithEmailAndPassword: vi.fn(() =>
      Promise.resolve({ user: { email: "test@example.com" } })
    ),
    createUserWithEmailAndPassword: vi.fn(() =>
      Promise.resolve({ user: { email: "new@example.com" } })
    ),
    signInWithPopup: vi.fn(() =>
      Promise.resolve({ user: { email: "google@example.com" } })
    ),
    GoogleAuthProvider: vi.fn(),
  };
});

// Componente de prueba que consume el contexto
function TestComponent() {
  const { user, loading, signIn, signUp, signInWithGoogle, logout } = useAuth();

  return (
    <div>
      <p>{loading ? "Cargando..." : `Usuario: ${user?.email}`}</p>
      <button onClick={() => signIn("test@example.com", "1234")}>SignIn</button>
      <button onClick={() => signUp("new@example.com", "1234")}>SignUp</button>
      <button onClick={() => signInWithGoogle()}>Google</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

describe("AuthProvider", () => {
  it("muestra usuario inicial y permite usar funciones", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Usuario inicial
    expect(await screen.findByText(/Usuario: test@example.com/)).toBeTruthy();

    // Simula signUp
    await act(async () => {
      screen.getByText("SignUp").click();
    });
    expect(await screen.findByText(/Usuario: new@example.com/)).toBeTruthy();

    // Simula Google
    await act(async () => {
      screen.getByText("Google").click();
    });
    expect(await screen.findByText(/Usuario: google@example.com/)).toBeTruthy();

    // Simula logout
    await act(async () => {
      screen.getByText("Logout").click();
    });
    expect(await screen.findByText(/Usuario:/)).toBeTruthy();
  });
});