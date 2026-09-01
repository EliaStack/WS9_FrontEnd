/** @vitest-environment jsdom */
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CreateTag from '../pages/CreateTag';

const mockPost = vi.fn();
vi.mock('../services/api.js', () => ({
  post: (...args) => mockPost(...args),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CreateTag', () => {
  it('Soumet le formulaire avec les bonnes valeurs', async () => {
    render(<CreateTag></CreateTag>, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText('Titre'), {
      target: { value: 'Nouveau tag' },
    });

    fireEvent.click(screen.getByText('Créer'));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('api/tags/tagCreate', {
        name: 'Nouveau tag',
        project: undefined,
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/projects', {
        state: { projectId: undefined },
      });
    });
  });
});
