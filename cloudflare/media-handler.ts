/**
 * Locked door to the media Container: nothing starts without the admin secret.
 */
import { hasAdminSecret } from './admin-auth';

export async function handleMediaRequest(
  request: Request,
  secret: string | undefined,
  runInContainer: (request: Request) => Promise<Response>,
): Promise<Response> {
  if (!(await hasAdminSecret(request, secret))) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  if (request.method !== 'POST' || url.pathname !== '/spike/download') {
    return Response.json({ ok: false, error: 'Not found' }, { status: 404 });
  }

  try {
    return await runInContainer(
      new Request(new URL('/download', url), { method: 'POST', body: await request.text() }),
    );
  } catch (error) {
    return Response.json({ ok: false, error: (error as Error).message }, { status: 502 });
  }
}
