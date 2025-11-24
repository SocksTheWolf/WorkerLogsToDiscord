import { WorkerEntrypoint } from "cloudflare:workers";
import { Webhook, MessageBuilder } from 'minimal-discord-webhook-node';

export default class Logger extends WorkerEntrypoint {
  getLogger(hookURL=null) {
    const webhookLocation = (hookURL === null) ? this.env.WEB_HOOK : hookURL;
    return new Webhook({
      url: webhookLocation,
      throwErrors: false,
      retryOnLimit: true
    });
  }
  async postLog(name, msg, hookURL=null) {
    const log = this.getLogger(hookURL);
    log.setUsername(name);

    const embed = new MessageBuilder()
    .setTitle(`Log message from ${name}`)
    .setDescription(msg)
    .setColor("#f0f6fc")
    .setTimestamp();

    await log.send(embed);
  }

  async postError(name, msg, hookURL=null) {
    const log = this.getLogger(hookURL);
    log.setUsername(name);

    const embed = new MessageBuilder()
    .setTitle(`Error state from ${name}`)
    .setDescription(msg)
    .setColor("#ff6041")
    .setTimestamp();
    await log.send(embed);
  }

  async postWarning(name, msg, hookURL=null) {
    const log = this.getLogger(hookURL);
    log.setUsername(name);

    const embed = new MessageBuilder()
    .setTitle(`New Warning from ${name}`)
    .setDescription(msg)
    .setColor("#ff9640")
    .setTimestamp();
    await log.send(embed);
  }

  // basically return nothing
  async fetch(request, env, ctx) {
    return new Response('Hello World!');
  }
};