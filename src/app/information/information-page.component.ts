import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
	selector: 'app-information-page',
	templateUrl: './information-page.component.html',
	styleUrls: ['./information-page.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [MatExpansionModule],
})
export class InformationPageComponent {}
