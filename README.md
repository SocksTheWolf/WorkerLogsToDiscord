# WorkerLogsToDiscord

This hackjob of a worker allows you to push execution logs of any worker to a Discord webhook.

## Setup

Clone this repository and upload it to Cloudflare Workers. Add a `WEB_HOOK` secret on your Cloudflare dashboard that contains the Discord webhook url.

## To Log a Worker

* Add this code somewhere in the worker's code.

```js
const Logger = {
  useForwarder: false,
  logger: null,
  serviceName: "",

  configure: function(env) {
      this.logger = env.LOGGER;
      this.serviceName = env.WORKER_NAME || "Worker";
      this.useForwarder = env.USE_LOG_FORWARDER === "true";
  },
  log: async function(msg, hookOverride=null) {
      if (!this.useForwarder)
      {
          console.log(`${this.serviceName}: ${msg}`);
          return;
      }
      await this.logger.postLog(this.serviceName, msg, hookOverride);
  },
  error: async function(msg, hookOverride=null) {
      if (!this.useForwarder)
      {
          console.error(`${this.serviceName}: ${msg}`);
          return;
      }
      await this.logger.postError(this.serviceName, msg);
  },
  warn: async function(msg, hookOverride=null) {
        if (!this.useForwarder)
        {
            console.warn(`${this.serviceName}: ${msg}`);
            return;
        }
        await this.logger.postWarning(this.serviceName, msg);
    }
};
```
(Or you can use the `logger.ts` file)

* Call the function `Logger.configure(env);` on any entrypoint to your worker (`fetch`, `schedule`, etc).

* Add the following to your `worker.toml`:

```toml
services = [
  { binding = "LOGGER", service = "workerlogstodiscord" },
]

[vars]
# if log forwarding should be used
USE_LOG_FORWARDER = "true"
# worker name (used for logging)
WORKER_NAME = "NAME OF SERVICE"
```

* When logging, replace any `console.` with `await Logger.`. Log, Warn, Error redirectors are all provided.
