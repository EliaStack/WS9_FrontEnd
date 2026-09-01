/** @vitest-environment jsdom */
import { MemoryRouter } from 'react-router-dom';
import CreateProject from '../pages/CreateProject';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mockPost = vi.fn();
const mockGet = vi.fn().mockResolvedValue({ data: [] });
vi.mock('../services/api.js', () => ({
  post: (...args) => mockPost(...args),
  get: (...args) => mockGet(...args),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CreateProject', () => {
  it('Soumet le formulaire avec les bonnes valeurs', async () => {
    render(<CreateProject></CreateProject>, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText('Titre'), {
      target: { value: 'Nouveau projet' },
    });

    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'Contenu de la description' },
    });

    // Status et Créateur sont readOnly : impossible de les changer via l'UI,
    // ils gardent donc leurs valeurs par défaut ('Actif' et undefined ici)

    fireEvent.click(screen.getByText('Créer'));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('api/projet/projetCreate', {
        title: 'Nouveau projet',
        description: 'Contenu de la description',
        startAt: '',
        endAt: '',
        status: 'Actif',
        owner: undefined,
        members: [],
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/projects');
    });
  });
});
