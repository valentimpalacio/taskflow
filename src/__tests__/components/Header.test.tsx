import { describe, it, expect, vi } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '@/components/dashboard/Header';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ locale: 'en' }),
  usePathname: () => '/en',
}));

vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: { email: 'test@test.com', name: 'Test User' },
    },
    status: 'authenticated',
  }),
  signOut: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      header: {
        title: 'TaskFlow',
        logout: 'Logout',
      },
    };
    return translations[namespace]?.[key] || `${namespace}.${key}`;
  },
  useLocale: () => 'en',
}));

vi.mock('@/i18n/config', () => ({
  languages: ['pt', 'en', 'es'],
  languageNames: { pt: 'Português', en: 'English', es: 'Español' },
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
  });

  it('renders the TaskFlow title', () => {
    render(<Header />);
    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
  });

  it('renders logout button when session exists', () => {
    render(<Header />);
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('renders language switcher', () => {
    render(<Header />);
    expect(screen.getByText('PT')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('ES')).toBeInTheDocument();
  });

  it('renders dark mode toggle button', () => {
    render(<Header />);
    const toggleButtons = screen.getAllByRole('button');
    const ariaLabelButton = toggleButtons.find(btn => btn.getAttribute('aria-label') === 'Toggle dark mode');
    expect(ariaLabelButton).toBeTruthy();
  });
});
