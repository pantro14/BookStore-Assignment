import { FormControl } from '@angular/forms';
import { BookDTO } from '@openapi';

export type BookFormData = Required<Omit<BookDTO, 'id' | 'lastUpdated' | 'lastUpdatedBy'>>;

export type BookDialogData = {
  bookFormData: BookFormData;
  onSubmit: (data: BookFormData) => void;
  onClose: () => void;
};

export type BookFormType = {
  [K in keyof BookFormData]: FormControl<BookFormData[K] | null>;
};
