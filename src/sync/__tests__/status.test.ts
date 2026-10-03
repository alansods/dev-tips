import { en } from '../../i18n/en';
import { ptBR } from '../../i18n/pt-BR';
import { syncStatusView } from '../status';

const now = 10 * 60_000;
const base = { status: 'idle' as const, lastSyncedAt: now - 30_000, pendingCount: 0, online: true };

describe('Requirement: Estado da sincronização', () => {
  it('Sincronizado', () => {
    expect(syncStatusView(ptBR, base, now).text).toBe('Sincronizado agora há pouco');
  });

  it('há N minutos', () => {
    expect(syncStatusView(ptBR, { ...base, lastSyncedAt: now - 5 * 60_000 }, now).text).toBe(
      'Sincronizado há 5 minutos',
    );
    expect(syncStatusView(ptBR, { ...base, lastSyncedAt: now - 60_000 }, now).text).toBe('Sincronizado há 1 minuto');
  });

  it('Sincronizando', () => {
    expect(syncStatusView(ptBR, { ...base, status: 'syncing' }, now).text).toBe('Sincronizando…');
  });

  it('Sem conexão com mudanças pendentes', () => {
    expect(syncStatusView(ptBR, { ...base, online: false, pendingCount: 2 }, now).text).toBe('Aguardando conexão');
    expect(syncStatusView(ptBR, { ...base, status: 'offline', pendingCount: 1 }, now).text).toBe('Aguardando conexão');
  });

  it('sem conexão e nada pendente continua mostrando a última sincronização', () => {
    expect(syncStatusView(ptBR, { ...base, online: false }, now).text).toBe('Sincronizado agora há pouco');
  });

  it('erro da API', () => {
    expect(syncStatusView(ptBR, { ...base, status: 'error' }, now).text).toBe('Não foi possível sincronizar');
  });

  it('em inglês', () => {
    expect(syncStatusView(en, { ...base, lastSyncedAt: now - 2 * 60_000 }, now).text).toBe('Synced 2 minutes ago');
  });
});
