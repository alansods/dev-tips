// Enquanto o motor aplica mudanças vindas da nuvem, o rastreamento não as
// coloca de volta na fila.

let applying = false;

export const isApplyingRemote = () => applying;

export function applyingRemote(fn: () => void) {
  applying = true;
  try {
    fn();
  } finally {
    applying = false;
  }
}
