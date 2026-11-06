import { getCloudflareContext } from '@opennextjs/cloudflare';

export function getDb(): any {
  return (getCloudflareContext().env as any).DB;
}
