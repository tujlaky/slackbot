import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Receiver } from "https://deno.land/x/upstash_qstash@v0.1.4/mod.ts";

serve(async (req: Request) => {
  const signature = req.headers.get("Upstash-Signature")!;

  if (!signature) {
    return new Response("Invalid signature", { status: 401 });
  }

  const r = new Receiver({
    currentSigningKey: Deno.env.get("QSTASH_CURRENT_SIGNING_KEY")!,
    nextSigningKey: Deno.env.get("QSTASH_NEXT_SIGNING_KEY")!,
  });

  const isValid = await r.verify({
    signature: signature,
    body: await req.text(),
  }).catch((err: Error) => {
    console.error(err);
    return false;
  });

  if (!isValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  console.log("The signature was valid");
  const { WEBHOOK_URL, UID } = Deno.env.toObject();

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
