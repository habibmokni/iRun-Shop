import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSelectedComponent } from './storeSelectcomponent';

describe('StoreSelectedComponent', () => {
  let component: StoreSelectedComponent;
  let fixture: ComponentFixture<StoreSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreSelectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
