import { IconButton } from '../components/IconButton';
import { MoonIcon, SunIcon } from '../components/icons';
import { useT } from '../i18n';
import { useTheme } from './ThemeProvider';

/** Botão do cabeçalho que alterna entre claro e escuro. */
export function ThemeToggle() {
  const { scheme, colors, toggle } = useTheme();
  const t = useT();
  return (
    <IconButton label={scheme === 'dark' ? t.themeToggle.toLight : t.themeToggle.toDark} onPress={toggle}>
      {scheme === 'dark' ? <SunIcon color={colors.ink} /> : <MoonIcon color={colors.ink} />}
    </IconButton>
  );
}
