import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'mxs-book-form',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookFormComponent {
  @Input() initialData: { title?: string; author?: string } | null = null;
  @Output() submitForm = new EventEmitter<{ title: string; author: string }>();
  @Output() cancelForm = new EventEmitter<void>();

  readonly bookForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, this.titleValidator]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      pageCount: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]],
      onSale: [false],
    });
  }

  titleValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string' || value.trim().length === 0) {
      return { required: true };
    }
    const validPattern = /^[\w\s\-\.,'":;!?()&@#%$]+$/u;
    return validPattern.test(value.trim()) ? null : { invalidTitle: true };
  }

  get title() {
    return this.bookForm.get('title');
  }
  get price() {
    return this.bookForm.get('price');
  }
  get pageCount() {
    return this.bookForm.get('pageCount');
  }
}
