import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const { SLACK_BOT_TOKEN, WEBHOOK_URL, UID } = Deno.env.toObject();

serve(async (req: Request) => {
  const url = new URL(req.url);
  const secret = url.searchParams.get('secret');

  if (!secret || secret !== SLACK_BOT_TOKEN) {
    return new Response('Invalid token', {
      status: 403
    });
  }

  await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: `<@${UID}> Start here`
    })
  });

  return new Response(null, {
    status: 201
  });
});
