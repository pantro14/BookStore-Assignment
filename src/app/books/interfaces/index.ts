import { FormControl } from '@angular/forms';
import { BookDTO } from '@openapi';

export type BookFormData = Required<Omit<BookDTO, 'id' | 'lastUpdated' | 'lastUpdatedBy'>>;
export type BookAction = 'Create' | 'Edit' | 'View' | 'Delete';

export type BookDialogData = {
  bookFormData: BookFormValue;
  onSubmit: (data?: BookFormData) => void;
  onClose: () => void;
};

export type BookFormType = {
  [K in keyof BookFormData]: FormControl<BookFormData[K] | null>;
};

export type BookFormValue = {
  [K in keyof BookFormData]: BookFormData[K] | null;
};
