export default class Logger {
  useForwarder: boolean;
  logger: any;
  serviceName: string;
  logHook: string|null;
  ctx: any;
  isDebug: boolean;

  constructor(env: Record<string, any>, ctx=null) {
    this.logger = env.LOGGER;
    this.serviceName = env.LOGGING_SETTINGS.WORKER_NAME ?? "Worker";
    this.useForwarder = env.LOGGING_SETTINGS.USE_LOG_FORWARDER ?? true;
    this.logHook = env.LOGGING_HOOK ?? null;
    this.isDebug = env.DEBUG ?? false;
    this.ctx = ctx;
  }
  async log(msg: string) {
    if (!this.useForwarder || this.isDebug) {
      console.log(`${this.serviceName}: ${msg}`);
      return;
    }
    const call = this.logger.postLog(this.serviceName, msg, this.logHook);
    if (this.ctx !== null)
      this.ctx.waitUntil(call);
    else
      await call;
  };
  async error(msg: string) {
    if (!this.useForwarder || this.isDebug) {
      console.error(`${this.serviceName}: ${msg}`);
      return;
    }
    const call = this.logger.postError(this.serviceName, msg, this.logHook);
    if (this.ctx !== null)
      this.ctx.waitUntil(call);
    else
      await call;
  }
  async warn(msg: string) {
    if (!this.useForwarder || this.isDebug) {
      console.warn(`${this.serviceName}: ${msg}`);
      return;
    }
    const call = this.logger.postWarning(this.serviceName, msg, this.logHook);
    if (this.ctx !== null)
      this.ctx.waitUntil(call);
    else
      await call;
  }
};