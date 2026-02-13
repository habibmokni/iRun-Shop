import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

import { ClickNCollectService } from '@habibmokni/cnc';
import { ProductService } from './shared/services/product.service';
import { StoreService } from './shared/services/store.service';
import { UserService } from './shared/services/user.service';
import { User } from './shared/models/user.model';
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
  private readonly destroyRef = inject(DestroyRef);

  protected readonly showIntro = signal(this.loadIntroState());

  constructor() {
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

  private initCncBridge(): void {
    this.storeService.store
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((storeList) => {
        this.cncService.setStoreList(storeList);
        this.cncService.setStoreLocations(this.storeService.storeLocations);
      });

    this.userService.user$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((user): user is User => !!user)
      )
      .subscribe((user) => this.cncService.setUser(user));

    this.productService.cart$
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
