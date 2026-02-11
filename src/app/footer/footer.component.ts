import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProductService } from '../shared/services/product.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true,
  imports: [RouterModule, MatToolbarModule]
})
export class FooterComponent implements OnInit {
  productService = inject(ProductService);



  ngOnInit(): void {
  }

}
