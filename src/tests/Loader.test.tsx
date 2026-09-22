import { render, screen } from "@testing-library/react";
import Loader from "../components/Loader";

describe("Loader", () => {
    it("renderiza el spinner", () => {
        render(<Loader />);
        expect(document.querySelector(".spinner")).toBeInTheDocument();
    });

    it("muestra el mensaje por defecto", () => {
        render(<Loader />);
        expect(screen.getByText("Cargando...")).toBeInTheDocument();
    });

    it("muestra un mensaje personalizado", () => {
        render(<Loader message="Cargando tareas..." />);
        expect(screen.getByText("Cargando tareas...")).toBeInTheDocument();
    });
});