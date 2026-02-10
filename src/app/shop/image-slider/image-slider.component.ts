import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css'],
  standalone: true,
  imports: []
})
export class ImageSliderComponent implements OnInit {

  @Input() productImages: string[] = []

  constructor() { }

  ngOnInit(): void {
  }

}
