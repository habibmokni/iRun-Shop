import { Component, OnInit, inject, ChangeDetectionStrategy, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class IntroComponent implements OnInit {
  private router = inject(Router);


  readonly showIntro = output<boolean>();

  ngOnInit(): void {
  }

  onClick(){
    this.showIntro.emit(false);
    this.router.navigate(['/home']);
  }
}
