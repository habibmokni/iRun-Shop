import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
@Injectable()
export class SnackbarService{

  constructor(private snackBar: MatSnackBar){}

  success(title: any) {
    this.snackBar.open(title, "", {
      duration: 1000,
      panelClass: 'snackbar-success',
      verticalPosition: 'top'
    });
  }
  info(title: any) {
    this.snackBar.open(title, '', {
      duration: 1000,
      panelClass: 'snackbar-info',
      verticalPosition: 'top'
    });
  }
  warning(title: any) {
    this.snackBar.open(title, "Dismiss", {
      duration: 1000,
      panelClass: 'snackbar-warning',
      verticalPosition: 'top'
    });
  }
  error(title: any) {
    this.snackBar.open(title, "Dismiss", {
      duration: 1000,
      panelClass: 'snackbar-error',
      verticalPosition: 'top'
    });
  }
  wait(title: any) {
    this.snackBar.open(title, "Dismiss", {
      duration: 1000,
      panelClass: 'snackbar-wait',
      verticalPosition: 'top'
    });
  }
}
