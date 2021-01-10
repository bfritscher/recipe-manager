import Vue from "vue";
import * as Sentry from "@sentry/browser";
import { Vue as VueIntegration } from "@sentry/integrations";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "https://eb163101a21448098dd07580fb8d0c7f@sentry.j42.org/18",
  integrations: [
    new VueIntegration({
      Vue,
      tracing: true,
      logErrors: true
    }),
    new Integrations.BrowserTracing()
  ],
  tracingOptions: {
    trackComponents: true
  },
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0
});
