import { useEffect } from 'react';

import { useKakaoOAuthRedirect } from '@business/hooks/auth';

export function OAuthRedirectHandlePage() {
  const { login } = useKakaoOAuthRedirect();

  useEffect(() => {
    login();
  }, []);

  return (
    <div className="w-full h-full flex-with-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}
