import { fireEvent, screen } from '@testing-library/react-native';
import { useState } from 'react';

import type { Card, StepCard } from '../../../content';
import { ptBR } from '../../../i18n/pt-BR';

const FRONT_PROMPT = ptBR.card.frontPrompt;
import { cardById, crudTheme, renderWithTheme } from '../../../test-utils';
import { CardFace } from '../CardFace';

/** CardFace com a aba de framework controlada, como a sessão faz. */
function Harness({ card, side }: { card: Card; side: 'front' | 'back' }) {
  const [variant, setVariant] = useState('express');
  return <CardFace card={card} theme={crudTheme} side={side} variantId={variant} onSelectVariant={setVariant} />;
}
const show = (id: string, side: 'front' | 'back') => renderWithTheme(<Harness card={cardById(id)} side={side} />);

describe('Requirement: Frente e verso por tipo de card', () => {
  it('Endpoint', () => {
    show('endpoint-create', 'front');
    expect(screen.getByText('POST')).toBeOnTheScreen();
    expect(screen.getByText('/products')).toBeOnTheScreen();
    expect(screen.getByText(FRONT_PROMPT.endpoint)).toBeOnTheScreen();
    screen.unmount();

    show('endpoint-create', 'back');
    expect(screen.getByText('C · Create')).toBeOnTheScreen();
    expect(screen.getByText('Cria um produto')).toBeOnTheScreen();
    expect(screen.getByText('201')).toBeOnTheScreen();
    expect(screen.getByText('400')).toBeOnTheScreen();
  });

  it('Passo', () => {
    show('step-07', 'front');
    expect(screen.getByText('Passo 7')).toBeOnTheScreen();
    expect(screen.getByText('C: Criar produto')).toBeOnTheScreen();
    expect(screen.getByText(FRONT_PROMPT.step)).toBeOnTheScreen();
    screen.unmount();

    show('step-07', 'back');
    expect(screen.getAllByRole('tab').map((t) => t.props.accessibilityLabel ?? '')).toEqual([
      'Express',
      'Spring Boot',
      'NestJS',
      'FastAPI',
    ]);
    const step = cardById('step-07') as StepCard;
    expect(screen.getByText(step.snippets.express.code)).toBeOnTheScreen();
  });

  it('Comparação', () => {
    show('cmp-dto', 'back');
    for (const col of crudTheme.compareColumns!) expect(screen.getByText(col.label)).toBeOnTheScreen();
    expect(screen.getByText('modelo Pydantic')).toBeOnTheScreen();
    expect(screen.getByText('record')).toBeOnTheScreen();
  });

  it('Conceito', () => {
    show('cors', 'front');
    expect(screen.getByText('CORS')).toBeOnTheScreen();
    expect(screen.getByText(FRONT_PROMPT.concept)).toBeOnTheScreen();
    screen.unmount();

    show('cors', 'back');
    expect(screen.getByText(/Regra de segurança do navegador/)).toBeOnTheScreen();
  });

  it('Complemento', () => {
    show('docker-compose', 'front');
    expect(screen.getByText('Complemento')).toBeOnTheScreen();
    screen.unmount();

    show('docker-compose', 'back');
    expect(screen.getByText('Complemento')).toBeOnTheScreen();
    expect(screen.getByText(/container_name: products-db/)).toBeOnTheScreen();
  });

  it('cards originais não têm o selo', () => {
    show('step-07', 'front');
    expect(screen.queryByText('Complemento')).toBeNull();
  });
});

describe('Requirement: Abas de framework', () => {
  it('Trocar de framework', () => {
    show('step-01', 'back');
    expect(screen.getByRole('tab', { name: 'Express' })).toBeSelected();
    fireEvent.press(screen.getByRole('tab', { name: 'FastAPI' }));
    expect(screen.getByRole('tab', { name: 'FastAPI' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'Express' })).not.toBeSelected();
    expect(screen.getByText(/python -m venv \.venv/)).toBeOnTheScreen();
  });
});

describe('Requirement: Exibição de código', () => {
  it('Código preservado na tela', () => {
    function FastApi() {
      return (
        <CardFace
          card={cardById('step-03')}
          theme={crudTheme}
          side="back"
          variantId="fastapi"
          onSelectVariant={() => {}}
        />
      );
    }
    renderWithTheme(<FastApi />);
    const snippet = (cardById('step-03') as StepCard).snippets.fastapi;
    expect(screen.getByText(snippet.code)).toBeOnTheScreen();
    expect(screen.getByText('app/database.py')).toBeOnTheScreen();
    expect(screen.getByText(snippet.note!)).toBeOnTheScreen();
  });

  it('variante desconhecida cai na primeira do tema', () => {
    renderWithTheme(
      <CardFace
        card={cardById('step-03')}
        theme={crudTheme}
        side="back"
        variantId="rails"
        onSelectVariant={() => {}}
      />,
    );
    expect(screen.getByRole('tab', { name: 'Express' })).toBeSelected();
  });
});

describe('Requirement: Frente e verso por tipo de card (pergunta)', () => {
  it('Pergunta de entrevista', () => {
    show('put-vs-patch', 'front');
    expect(screen.getByText('Qual a diferença entre PUT e PATCH?')).toBeOnTheScreen();
    expect(screen.getByText(FRONT_PROMPT.question)).toBeOnTheScreen();
    expect(screen.getByText('Complemento')).toBeOnTheScreen();
    expect(screen.getByText('Entrevista')).toBeOnTheScreen();
    screen.unmount();

    show('put-vs-patch', 'back');
    expect(screen.getByText(/PUT substitui o recurso inteiro/)).toBeOnTheScreen();
    expect(screen.getByText(/curl -X PUT[\s\S]*curl -X PATCH/)).toBeOnTheScreen();
  });
});
