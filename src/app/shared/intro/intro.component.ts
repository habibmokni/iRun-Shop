import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css'],
  standalone: true,
  imports: []
})
export class IntroComponent implements OnInit {
  private router = inject(Router);


  @Output() showIntro = new EventEmitter<boolean>();

  ngOnInit(): void {
  }

  onClick(){
    this.showIntro.emit(false);
    this.router.navigate(['/home']);
  }
}
