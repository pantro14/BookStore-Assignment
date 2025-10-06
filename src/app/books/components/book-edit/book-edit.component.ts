import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'mxs-book-edit',
  imports: [],
  templateUrl: './book-edit.component.html',
  styleUrl: './book-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookEditComponent {
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  @Input() bookId = '';

  close() {
    this.router.navigate(['/books']);
  }
}
