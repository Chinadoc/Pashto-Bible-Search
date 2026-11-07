import { Container, getContainer } from '@cloudflare/containers';
import { handleMediaRequest } from './media-handler';

interface Env {
  ADMIN_API_SECRET?: string;
  MEDIA_CONTAINER: DurableObjectNamespace<MediaContainer>;
}

export class MediaContainer extends Container {
  defaultPort = 8080;
  sleepAfter = '2m';
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleMediaRequest(request, env.ADMIN_API_SECRET, (forwarded) =>
      getContainer(env.MEDIA_CONTAINER).fetch(forwarded),
    );
  },
};
