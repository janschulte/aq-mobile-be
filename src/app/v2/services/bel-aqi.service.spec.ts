import { TestBed } from '@angular/core/testing';

import { BelAQIService } from './bel-aqi.service';
import {TranslateTestingModule} from '../testing/TranslateTestingModule';

xdescribe('BelAQIService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [TranslateTestingModule]
  }));

  it('should be created', () => {
    const service: BelAQIService = TestBed.get(BelAQIService);
    expect(service).toBeTruthy();
  });
});