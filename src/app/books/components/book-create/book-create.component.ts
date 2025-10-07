import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { BookFormComponent } from '../book-form/book-form.component';

@Component({
  selector: 'mxs-book-create',
  templateUrl: './book-create.component.html',
  styleUrl: './book-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCreateComponent implements AfterViewInit {
  protected readonly router = inject(Router);
  readonly dialog = inject(MatDialog);

  ngAfterViewInit(): void {
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/books']);
    });
  }
}
