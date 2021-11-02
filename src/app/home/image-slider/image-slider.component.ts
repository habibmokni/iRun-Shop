import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent implements OnInit {

  @Input() productImages: string[] = [
    "../../assets/images/products/nike/NIKE-JOYRIDE-RUN-FLYKNIT/AQ2731-102/big/big0.jpeg",
    "../../assets/images/products/nike/NIKE-Pegasus-Trail-3/DA8698-001/big/big0.jpg",
    "../../assets/images/products/nike/NIKE-JOYRIDE-RUN-FLYKNIT/AQ2730-001/big/big1.jpg",
    "../../assets/images/products/new-balance/TC-v1/big/big1.jpg",
    "../../assets/images/products/new-balance/RC-Elite-v2/big/big0.jpg"
  ]
  mainImage: string = '';

  constructor() { }

  ngOnInit(): void {
    this.mainImage = this.productImages[0];
  }
  onImageSelect(image : string){
    this.mainImage = image;
  }
}
