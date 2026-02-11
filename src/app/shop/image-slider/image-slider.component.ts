import { Component, input, OnInit, ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class ImageSliderComponent implements OnInit {

  readonly productImages = input<string[]>([]);

  constructor() { }

  ngOnInit(): void {
  }

}
