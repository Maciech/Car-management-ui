import {ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';
import localePl from '@angular/common/locales/pl';

import {routes} from './app.routes';
import {authInterceptor} from './shared/ui/authorization/auth.interceptor';

// Rejestracja polskiej lokalizacji (PLN, formatowanie liczb, daty)
registerLocaleData(localePl);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    {provide: LOCALE_ID, useValue: 'pl'},
  ]
};
