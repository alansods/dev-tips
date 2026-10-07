import { Screen } from '../../components/Screen';
import { RemindersSection } from '../../reminders/RemindersSection';
import { AboutSection } from '../../settings/AboutSection';
import { AccountSection } from '../../settings/AccountSection';
import { InterestsSection } from '../../settings/InterestsSection';
import { LanguageSection } from '../../settings/LanguageSection';
import { StudySummary } from '../../settings/StudySummary';
import { ThemeSection } from '../../settings/ThemeSection';

/** Aba Perfil: conta, resumo do estudo, idioma, lembretes, tema e sobre. */
export default function ProfileScreen() {
  return (
    <Screen>
      <AccountSection />
      <StudySummary />
      <InterestsSection />
      <LanguageSection />
      <RemindersSection />
      <ThemeSection />
      <AboutSection />
    </Screen>
  );
}
