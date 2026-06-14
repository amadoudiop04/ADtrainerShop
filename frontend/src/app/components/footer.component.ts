import { Component } from '@angular/core';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: '../pages/Footer/footer.page.html',
  styleUrls: ['../pages/Footer/footer.scss'],
})
export class FooterComponent {}
