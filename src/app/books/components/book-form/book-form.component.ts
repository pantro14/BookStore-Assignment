import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BookDialogData, BookFormData, BookFormType } from '@app/books/interfaces';

@Component({
  selector: 'mxs-book-form',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookFormComponent {
  readonly data = inject<BookDialogData>(MAT_DIALOG_DATA);
  private formBuilder = inject(FormBuilder);

  readonly bookForm: FormGroup<BookFormType>;

  constructor() {
    const { title, price, pageCount, onSale } = this.data.bookFormData;
    this.bookForm = this.formBuilder.group<BookFormType>({
      title: this.formBuilder.control<string | null>(title, [Validators.required, this.titleValidator]),
      price: this.formBuilder.control<number | null>(price, [Validators.required, Validators.min(0.01)]),
      pageCount: this.formBuilder.control<number | null>(pageCount, [
        Validators.required,
        Validators.min(1),
        Validators.pattern('^[0-9]+$'),
      ]),
      onSale: this.formBuilder.control<boolean | null>(onSale),
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

  get isFormValueUnchanged(): boolean {
    return Object.entries(this.bookForm.value).every(([key, value]) => {
      return value === this.data.bookFormData[key as keyof BookFormData];
    });
  }

  onSubmit() {
    this.data.onSubmit(this.bookForm.value as BookFormData);
  }

  onCancel() {
    this.data.onClose();
  }
}
