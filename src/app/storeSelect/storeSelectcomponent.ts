import { Component, NgZone, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-storeSelect',
  templateUrl: './storeSelect.component.html',
  styleUrls: ['./storeSelect.component.css'],
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StoreSelectedComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {}

}
