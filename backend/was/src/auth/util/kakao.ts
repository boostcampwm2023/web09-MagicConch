export function makeRequestTokenForm(
  clientId: string,
  redirectUri: string,
  code: string,
  clientSecret: string,
): URLSearchParams {
  const formData = new URLSearchParams();
  formData.append('grant_type', 'authorization_code');
  formData.append('client_id', clientId);
  formData.append('redirect_uri', redirectUri);
  formData.append('code', code);
  formData.append('client_secret', clientSecret);
  return formData;
}

export function makeRefreshTokenForm(
  clientId: string,
  refreshToken: string,
  clientSecret: string,
): URLSearchParams {
  const formData = new URLSearchParams();
  formData.append('grant_type', 'refresh_token');
  formData.append('client_id', clientId);
  formData.append('refresh_token', refreshToken);
  formData.append('client_secret', clientSecret);
  return formData;
}
