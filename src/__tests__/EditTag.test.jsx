/** @vitest-environment jsdom */
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EditTag from "../pages/EditTag";

const mockPatch = vi.fn();
const mockGet = vi.fn().mockResolvedValue({
    data: {
        name: "Ancien Tag",
        project: {
            _id: "proj123",
            title: "Titre du projet",
        },
    }
});
vi.mock('../services/api.js', () => ({
    patch: (...args) => mockPatch(...args),
    get: (...args) => mockGet(...args),
}))

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: 'tagtest' }),
    }
})

vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({ token: 'fake-token' })
}))

const fakeTag = {
    name: "Ancien Tag",
    project: {
        _id: "proj123",
        title: "Titre du projet",
    },
};

describe("EditTag", () => {
    it('Soumet le formulaire avec les bonnes valeurs', async () => {
        render(
            <MemoryRouter initialEntries={[{
                pathname: '/tags/edit',
                state: { tag: fakeTag }
            }]}>
                <EditTag />
            </MemoryRouter>
        );

        // Attendre que les données initiales soient chargées avant d'interagir
        await screen.findByDisplayValue("Ancien Tag");

        fireEvent.change(screen.getByPlaceholderText("Titre"), {
            target: { value: "Tag modifiée" },
        });

        fireEvent.click(screen.getByText("Modifier"));

        await waitFor(() => {
            expect(mockPatch).toHaveBeenCalledWith('api/tags/tagtest', {
                name: "Tag modifiée",
                project: {
                    _id: "proj123",
                    title: "Titre du projet",
                },
            });
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/tasks', {
                state: { projectId: "proj123" },
            });
        });
    });
});