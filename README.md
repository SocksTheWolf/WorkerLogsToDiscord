# WorkerLogsToDiscord

Project for updating cloudflare worker logs automatically to discord webhook

To use:

* Add the following to your worker:

```js
const Logger = {
  useForwarder: false,
  logger: null,
  serviceName: "",

  configure: function(env) {
      this.logger = env.LOGGER;
      this.serviceName = env.WORKER_NAME;
      this.useForwarder = env.USE_LOG_FORWARDER === "true";
  },
  log: async function(msg) {
      if (!this.useForwarder)
      {
          console.log(`${this.serviceName}: ${msg}`);
          return;
      }
      await this.logger.postLog(this.serviceName, msg);
  },
  error: async function(msg) {
      if (!this.useForwarder)
      {
          console.error(`${this.serviceName}: ${msg}`);
          return;
      }
      await this.logger.postError(this.serviceName, msg);
  },
  warn: async function(msg) {
        if (!this.useForwarder)
        {
            console.warn(`${this.serviceName}: ${msg}`);
            return;
        }
        await this.logger.postWarning(this.serviceName, msg);
    }
};
```

* Call the function `Logger.configure(env);` on any entrypoint to your application.

* Add the following to your `worker.toml`:

```
services = [
  { binding = "LOGGER", service = "workerlogstodiscord" },
]

[vars]
# if log forwarding should be used
USE_LOG_FORWARDER = "true"
# worker name (used for logging)
WORKER_NAME = "NAME OF SERVICE"
```
