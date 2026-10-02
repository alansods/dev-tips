import { fireEvent, screen, within } from '@testing-library/react-native';
import { useState } from 'react';

import { CardFace } from '../../components/cards/CardFace';
import { cardById, crudTheme, renderWithTheme } from '../../test-utils';
import { TermSheet } from '../TermSheet';

/** Verso/frente de um card com chips ligados a uma gaveta, como na sessão. */
function Harness({ cardId, side }: { cardId: string; side: 'front' | 'back' }) {
  const [term, setTerm] = useState<string | null>(null);
  return (
    <>
      <CardFace
        card={cardById(cardId)}
        theme={crudTheme}
        side={side}
        variantId="express"
        onSelectVariant={() => {}}
        onOpenTerm={setTerm}
      />
      <TermSheet theme={crudTheme} termId={term} onChangeTerm={setTerm} onClose={() => setTerm(null)} />
    </>
  );
}
const show = (cardId: string, side: 'front' | 'back') => renderWithTheme(<Harness cardId={cardId} side={side} />);
const sheet = () => within(screen.getByTestId('term-sheet'));
const CORS_DEF = /Regra de segurança do navegador/;
const MIDDLEWARE_DEF = /Uma função que roda no meio do caminho/;

describe('Requirement: Termos relacionados no verso', () => {
  it('Chips no verso do passo', () => {
    show('step-13', 'back');
    expect(screen.getByText('Termos relacionados')).toBeOnTheScreen();
    const chips = screen.getAllByRole('button').map((b) => b.props.accessibilityLabel);
    expect(chips.filter((l) => l === 'CORS' || l === 'Middleware')).toEqual(['CORS', 'Middleware']);
  });

  it('Frente sem chips', () => {
    show('step-13', 'front');
    expect(screen.queryByText('Termos relacionados')).toBeNull();
    expect(screen.queryByRole('button', { name: 'CORS' })).toBeNull();
  });

  it('Card sem termos relacionados', () => {
    show('cmp-dto', 'back');
    expect(screen.queryByText('Termos relacionados')).toBeNull();
  });
});

describe('Requirement: Gaveta de definição', () => {
  it('Abrir a definição', () => {
    show('step-13', 'back');
    expect(screen.queryByTestId('term-sheet')).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'CORS' }));
    expect(sheet().getByRole('header', { name: 'CORS' })).toBeOnTheScreen();
    expect(sheet().getByText(CORS_DEF)).toBeOnTheScreen();
  });

  it('Navegar entre termos na gaveta', () => {
    show('step-13', 'back');
    fireEvent.press(screen.getByRole('button', { name: 'CORS' }));
    fireEvent.press(sheet().getByRole('button', { name: 'Middleware' }));
    expect(sheet().getByRole('header', { name: 'Middleware' })).toBeOnTheScreen();
    expect(sheet().getByText(MIDDLEWARE_DEF)).toBeOnTheScreen();
  });

  it('fechar pelo botão', () => {
    show('step-13', 'back');
    fireEvent.press(screen.getByRole('button', { name: 'CORS' }));
    fireEvent.press(sheet().getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByTestId('term-sheet')).toBeNull();
  });

  it('fechar tocando fora', () => {
    show('step-13', 'back');
    fireEvent.press(screen.getByRole('button', { name: 'CORS' }));
    fireEvent.press(screen.getByRole('button', { name: 'Fechar definição' }));
    expect(screen.queryByTestId('term-sheet')).toBeNull();
  });
});
