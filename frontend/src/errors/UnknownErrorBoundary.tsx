import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { SomethingWrongErrorPage } from '@pages/ErrorPage';

export function UnknownErrorBoundary({ children }: PropsWithChildren) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      FallbackComponent={SomethingWrongErrorPage}
      onReset={reset}
    >
      {children}
    </ErrorBoundary>
  );
}

export default UnknownErrorBoundary;
