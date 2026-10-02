import { IconButton } from '../components/IconButton';
import { MoonIcon, SunIcon } from '../components/icons';
import { useTheme } from './ThemeProvider';

/** Botão do cabeçalho que alterna entre claro e escuro. */
export function ThemeToggle() {
  const { scheme, colors, toggle } = useTheme();
  return (
    <IconButton label={scheme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'} onPress={toggle}>
      {scheme === 'dark' ? <SunIcon color={colors.ink} /> : <MoonIcon color={colors.ink} />}
    </IconButton>
  );
}
