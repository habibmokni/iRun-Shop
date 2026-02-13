import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'app-information-page',
	templateUrl: './information-page.component.html',
	styleUrls: ['./information-page.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [],
})
export class InformationPageComponent {}
