import type { PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { SomethingWrongErrorPage } from '@pages/ErrorPage';

export function SocketErrorBoundary({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary
      FallbackComponent={SomethingWrongErrorPage}
      onError={error => {
        console.log('soccket:', error);
        // error.name = 'SocketError';
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export default SocketErrorBoundary;
