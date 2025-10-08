import { RouterOutlet } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslateService } from '@ngx-translate/core';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [RouterOutlet],
    mocks: [TranslateService],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the app', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should set the default language to "da"', () => {
    const translateService = spectator.inject(TranslateService);
    expect(translateService.setDefaultLang).toHaveBeenCalledWith('da');
  });

  it('should set the translations for "da" language', () => {
    const translateService = spectator.inject(TranslateService);
    expect(translateService.setTranslation).toHaveBeenCalledWith('da', expect.any(Object));
  });
});
