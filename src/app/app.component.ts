import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

import { ClickNCollectService } from '@habibmokni/cnc';
import { AuthService } from './auth/auth.service';
import { ProductService } from './shared/services/product.service';
import { StoreService } from './shared/services/store.service';
import { UserService } from './shared/services/user.service';
import { HeaderComponent } from './header/header.component';
import { IntroComponent } from './shared/intro/intro.component';

const INTRO_STORAGE_KEY = 'intro_item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent, IntroComponent, MatDividerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  private readonly storeService = inject(StoreService);
  private readonly userService = inject(UserService);
  private readonly cncService = inject(ClickNCollectService);
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly showIntro = signal(this.loadIntroState());

  constructor() {
    this.authService.checkLogIn();
    this.initStoreData();
    this.initCncBridge();
  }

  protected onShowIntro(value: boolean): void {
    this.showIntro.set(value);
    localStorage.setItem(INTRO_STORAGE_KEY, JSON.stringify(value));
  }

  private loadIntroState(): boolean {
    const stored = localStorage.getItem(INTRO_STORAGE_KEY);
    return stored === null || JSON.parse(stored) !== false;
  }

  private initStoreData(): void {
    this.storeService.fetchStore();
    this.storeService.getStoreLocations();
  }

  private initCncBridge(): void {
    this.storeService.store
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((storeList) => this.cncService.setStoreList(storeList));

    this.cncService.setStoreLocations(this.storeService.storeLocations);

    if (this.userService.user) {
      this.cncService.setUser(this.userService.user);
    }
    this.userService.userSub
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cncService.setUser(this.userService.user));

    this.cncService.setCartProducts(this.productService.getLocalCartProducts());
    this.productService.cartProductsChanged
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cartProducts) =>
        this.cncService.setCartProducts(cartProducts)
      );

    this.cncService.storeSelected
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((store) => {
        this.userService.updateSelectedStore({
          name: 'Anonymous',
          storeSelected: store,
        });
      });
  }
}
