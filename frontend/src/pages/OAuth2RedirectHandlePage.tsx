import { useEffect } from 'react';

import { useKakaoOAuthRedirect } from '@business/hooks/useAuth';

function OAuthRedirectHandlePage() {
  const { login } = useKakaoOAuthRedirect();

  useEffect(() => {
    login();
  }, []);

  return <div>카카오 로그인 중...</div>;
}

export default OAuthRedirectHandlePage;
