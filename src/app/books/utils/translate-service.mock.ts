import { of } from 'rxjs';

export const translateServiceMock = {
  addLangs: jest.fn(),
  setDefaultLang: jest.fn(),
  use: jest.fn().mockReturnValue(of('da')),
  getLangs: jest.fn().mockReturnValue(['da', 'en']),
  get: jest.fn().mockImplementation((key: string) => of(key)),
  instant: jest.fn((key: string) => key),
  onLangChange: of({ lang: 'en' }),
  onTranslationChange: of(),
  onDefaultLangChange: of(),
};
