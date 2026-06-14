import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy, inject } from '@angular/core';
import { EffectRef, effect } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({ name: 't', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform, OnDestroy {
  private ts = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);
  private effectRef: EffectRef;

  constructor() {
    this.effectRef = effect(() => {
      this.ts.lang();
      this.cdr.markForCheck();
    });
  }

  transform(key: string): string {
    return this.ts.t(key);
  }

  ngOnDestroy(): void {
    this.effectRef.destroy();
  }
}
