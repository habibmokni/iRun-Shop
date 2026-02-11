import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ImageSliderComponent implements OnInit {

  @Input() productImages: string[] = []

  constructor() { }

  ngOnInit(): void {
  }

}
