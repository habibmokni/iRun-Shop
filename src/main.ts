import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi, withJsonpSupport } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { GoogleMapsModule } from '@angular/google-maps';
import { ClickNCollectModule } from '@habibmokni/cnc';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { StoreService } from './app/shared/services/store.service';
import { ProductService } from './app/shared/services/product.service';
import { SnackbarService } from './app/shared/services/snackbar.service';
import { UserService } from './app/shared/services/user.service';
import { routes } from './app/app.routes';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi(), withJsonpSupport()),
    importProvidersFrom(
      AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule,
      GoogleMapsModule,
      ClickNCollectModule
    ),
    StoreService,
    ProductService,
    SnackbarService,
    UserService
  ]
}).catch(err => console.error(err));
