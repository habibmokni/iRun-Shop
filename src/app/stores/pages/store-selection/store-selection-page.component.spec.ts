import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSelectionPageComponent } from './store-selection-page.component';

describe('StoreSelectionPageComponent', () => {
	let component: StoreSelectionPageComponent;
	let fixture: ComponentFixture<StoreSelectionPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [StoreSelectionPageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(StoreSelectionPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
