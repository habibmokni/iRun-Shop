import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
	{
		path: 'products',
		loadComponent: () =>
			import('./products/admin-products-page.component').then(
				(m) => m.AdminProductsPageComponent,
			),
	},
	{
		path: 'stores',
		loadComponent: () =>
			import('./stores/admin-stores-page.component').then((m) => m.AdminStoresPageComponent),
	},
	{
		path: '',
		redirectTo: 'products',
		pathMatch: 'full',
	},
];
