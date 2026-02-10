import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css'],
  standalone: true,
  imports: []
})
export class IntroComponent implements OnInit {

  @Output() showIntro = new EventEmitter<boolean>();
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClick(){
    this.showIntro.emit(false);
    this.router.navigate(['/home']);
  }
}
