/** @vitest-environment jsdom */
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Login from "../pages/Login";

const mockPost = vi.fn();
vi.mock('../services/api.js', () => ({
    post: (...args) => mockPost(...args)
}))

mockPost.mockResolvedValue({
    data: {
        token: 'fake-token',
        user: {
            _id: '123',
            email: 'test@123.fr'
        }
    }
});

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({ token: 'fake-token', setToken: vi.fn() })
}))

describe("Login", () => {
    it('Soumet le formulaire avec les bonnes valeurs', async () => {
        render(<Login></Login>, { wrapper: MemoryRouter });

        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "test@123.fr" },
        });

        fireEvent.change(screen.getByPlaceholderText("Mot de passe"), {
            target: { value: "123" },
        });

        fireEvent.click(screen.getByText("Se connecter"));

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('api/users/login', {
                email: "test@123.fr",
                password: "123",
            });
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/projects')
        });
    });
});