import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

import { SomethingWrongErrorPage } from '@pages/ErrorPage';

const APIErrorFallback = ({ error }: FallbackProps) => {
  if (
    isAxiosError<{
      errorCode: string;
      message: string;
    }>(error)
  ) {
    const responseBody = error.response?.data;

    // TODO: 에러코드 정의되면 여기서 에러 코드에 따른 작업을 해줘야함.
    switch (responseBody?.errorCode) {
    }

    // 에러 코드에 따른 작업 처리후 에러 페이지로 이동
    return <SomethingWrongErrorPage />;
  } else {
    // 그 외의 에러의 경우 상단 바운더리에서 처리
    throw error;
  }
};

export function APIErrorBoundary({ children }: { children: React.ReactNode }) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      FallbackComponent={APIErrorFallback}
      onReset={reset}
    >
      {children}
    </ErrorBoundary>
  );
}

export default APIErrorBoundary;
