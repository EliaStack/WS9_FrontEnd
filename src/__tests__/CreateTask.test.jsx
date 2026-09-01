/** @vitest-environment jsdom */
import { MemoryRouter } from 'react-router-dom';
import CreateTask from '../pages/CreateTask';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

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

describe('CreateTask', () => {
  it('Soumet le formulaire avec les bonnes valeurs', async () => {
    render(<CreateTask></CreateTask>, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText('Titre'), {
      target: { value: 'Nouvelle tâche' },
    });

    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'Contenu de la description' },
    });

    fireEvent.change(screen.getByPlaceholderText('Priority'), {
      target: { value: 'Medium' },
    });

    fireEvent.change(screen.getByPlaceholderText('Status'), {
      target: { value: 'in_progress' },
    });

    fireEvent.click(screen.getByText('Créer'));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('api/task/taskCreate', {
        title: 'Nouvelle tâche',
        description: 'Contenu de la description',
        dueAt: '',
        priority: 'Medium',
        status: 'in_progress',
        project: undefined,
        assignee: undefined,
        comment: '',
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/tasks', {
        state: { projectId: undefined },
      });
    });
  });
});
