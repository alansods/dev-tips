import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { COLOR_SCHEME_KEY, ThemeProvider, useTheme } from '../ThemeProvider';
import { ThemeToggle } from '../ThemeToggle';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({ __esModule: true, default: jest.fn() }));
// eslint-disable-next-line @typescript-eslint/no-require-imports
const useColorScheme = require('react-native/Libraries/Utilities/useColorScheme').default as jest.Mock;

function Probe() {
  const { scheme, colors } = useTheme();
  return <Text testID="probe">{`${scheme}:${colors.bg}`}</Text>;
}

async function renderWithTheme() {
  render(
    <ThemeProvider>
      <Probe />
      <ThemeToggle />
    </ThemeProvider>,
  );
  // espera a leitura assíncrona da preferência salva
  await act(async () => {});
}

beforeEach(async () => {
  await AsyncStorage.clear();
  useColorScheme.mockReturnValue('light');
});

describe('Requirement: Tema claro e escuro', () => {
  it('Segue o sistema por padrão', async () => {
    useColorScheme.mockReturnValue('dark');
    await renderWithTheme();
    expect(screen.getByTestId('probe')).toHaveTextContent('dark:#0C1015');
  });

  it('Alternar manualmente', async () => {
    await renderWithTheme();
    expect(screen.getByTestId('probe')).toHaveTextContent('light:#F3F4F7');
    fireEvent.press(screen.getByRole('button', { name: 'Usar tema escuro' }));
    expect(screen.getByTestId('probe')).toHaveTextContent('dark:#0C1015');
    expect(screen.getByRole('button', { name: 'Usar tema claro' })).toBeOnTheScreen();
    await act(async () => {});
    expect(await AsyncStorage.getItem(COLOR_SCHEME_KEY)).toBe('dark');
  });

  it('Escolha lembrada', async () => {
    await AsyncStorage.setItem(COLOR_SCHEME_KEY, 'dark');
    useColorScheme.mockReturnValue('light');
    await renderWithTheme();
    expect(screen.getByTestId('probe')).toHaveTextContent('dark:#0C1015');
  });

  it('Preferência indisponível', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('falhou'));
    useColorScheme.mockReturnValue('dark');
    await renderWithTheme();
    expect(screen.getByTestId('probe')).toHaveTextContent('dark:#0C1015');
  });

  it('erro síncrono do storage também é ignorado', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementationOnce(() => {
      throw new Error('storage indisponível');
    });
    useColorScheme.mockReturnValue('dark');
    await renderWithTheme();
    expect(screen.getByTestId('probe')).toHaveTextContent('dark:#0C1015');
  });

  it('ignora valor salvo inválido', async () => {
    await AsyncStorage.setItem(COLOR_SCHEME_KEY, 'roxo');
    useColorScheme.mockReturnValue('dark');
    await renderWithTheme();
    expect(screen.getByTestId('probe')).toHaveTextContent('dark:#0C1015');
  });

  it('sistema sem preferência cai no claro', async () => {
    useColorScheme.mockReturnValue(null);
    await renderWithTheme();
    expect(screen.getByTestId('probe')).toHaveTextContent('light:#F3F4F7');
  });
});
