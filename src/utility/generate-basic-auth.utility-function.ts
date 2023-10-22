export function generateBasicAuth(userName: string, apiKey: string) {
  return `Basic ${Buffer.from(`${userName}:${apiKey}`).toString('base64')}`;
}
