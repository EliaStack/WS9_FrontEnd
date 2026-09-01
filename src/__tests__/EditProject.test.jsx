/** @vitest-environment jsdom */
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EditProject from '../pages/EditProject';

const mockPatch = vi.fn();
const mockGet = vi.fn((url) => {
  if (url.includes('users')) {
    return Promise.resolve({ data: [] });
  }
  if (url.startsWith('api/projet/')) {
    return Promise.resolve({
      data: {
        title: 'Ancien titre',
        description: 'Ancienne description',
        startAt: '',
        endAt: '',
        status: 'actif',
        members: [],
      },
    });
  }
});
vi.mock('../services/api.js', () => ({
  patch: (...args) => mockPatch(...args),
  get: (...args) => mockGet(...args),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ token: 'fake-token' }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const fakeProject = {
  _id: 'proj123',
  owner: { firstName: 'Jean', lastName: 'Dupont' },
  members: [],
};

describe('EditProject (édition de projet)', () => {
  it('Soumet le formulaire avec les bonnes valeurs', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/projects/edit',
            state: { project: fakeProject, projectId: 'proj123' },
          },
        ]}
      >
        <EditProject></EditProject>
      </MemoryRouter>,
    );

    // Attendre que les données du projet soient chargées
    await screen.findByDisplayValue('Ancien titre');

    fireEvent.change(screen.getByPlaceholderText('Titre'), {
      target: { value: 'Projet modifié' },
    });

    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'Nouvelle description' },
    });

    fireEvent.click(screen.getByText('Modifier'));

    await waitFor(() => {
      expect(mockPatch).toHaveBeenCalledWith('api/projet/proj123', {
        title: 'Projet modifié',
        description: 'Nouvelle description',
        startAt: '',
        endAt: '',
        status: 'actif',
        owner: fakeProject.owner,
        members: [],
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/projects', {
        state: { projectId: 'proj123' },
      });
    });
  });
});
