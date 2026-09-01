/** @vitest-environment jsdom */
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import PrivateRoute from "../PrivateRoute";

describe("PrivateRoute", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("redirige vers /login si aucun token n'est présent", () => {
        render(
            <MemoryRouter initialEntries={["/projects"]}>
                <Routes>
                    <Route path="/projects" element={
                        <PrivateRoute><p>Contenu protégé</p></PrivateRoute>
                    } />
                    <Route path="/login" element={<p>Page de connexion</p>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Page de connexion")).toBeInTheDocument();
        expect(screen.queryByText("Contenu protégé")).not.toBeInTheDocument();
    });

    it("affiche le contenu protégé si un token est présent", () => {
        localStorage.setItem('token', 'fake-token');

        render(
            <MemoryRouter initialEntries={["/projects"]}>
                <Routes>
                    <Route path="/projects" element={
                        <PrivateRoute><p>Contenu protégé</p></PrivateRoute>
                    } />
                    <Route path="/login" element={<p>Page de connexion</p>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Contenu protégé")).toBeInTheDocument();
    });
});
