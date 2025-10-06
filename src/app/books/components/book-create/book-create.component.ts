import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mxs-book-create',
  imports: [],
  templateUrl: './book-create.component.html',
  styleUrl: './book-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCreateComponent {
  protected readonly router = inject(Router);
  close() {
    this.router.navigate(['/books']);
  }
}
