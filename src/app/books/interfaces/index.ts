import { FormControl } from '@angular/forms';
import { BookDTO } from '@openapi';

export type BookFormData = Required<Omit<BookDTO, 'id' | 'lastUpdated' | 'lastUpdatedBy' | 'author'>>;
export type BookDetails = BookFormData & Pick<BookDTO, 'author' | 'lastUpdatedBy'>;

export type BookFormType = {
  [K in keyof BookFormData]: FormControl<BookFormData[K] | null>;
};

export type BookFormValue = {
  [K in keyof BookFormData]: BookFormData[K] | null;
};
