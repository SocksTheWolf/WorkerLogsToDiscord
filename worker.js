import { WorkerEntrypoint } from "cloudflare:workers";
import DiscordLogger from 'node-discord-logger';

export default class Logger extends WorkerEntrypoint {
    getLogger() {
        return new DiscordLogger({
            hook: this.env.WEB_HOOK,
            serviceName: this.env.SERVICE_NAME
        });
    }
    async postLog(name, msg) {
        const log = this.getLogger();
        await log.info({
            message: `Log message from ${name}`,
            description: msg,
        });
    }

    async postError(name, msg, err=null) {
        const log = this.getLogger();
        await log.error({
            message: `Error state from ${name}`,
            message: msg,
            error: err
        });
    }

    async postWarning(name, msg) {
        const log = this.getLogger();
        await log.warn({
            message: `Error state from ${name}`,
            message: msg,
        });
    }

    // basically return nothing
    async fetch(request, env, ctx) {
        return new Response('Hello World!');
    }
};