// O expo-router/testing-library registra matchers de Jest, mas não publica os tipos deles.
declare global {
  namespace jest {
    interface Matchers<R> {
      toHavePathname(pathname: string): R;
    }
  }
}

export {};
