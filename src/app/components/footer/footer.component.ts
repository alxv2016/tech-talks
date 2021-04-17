import {ChangeDetectionStrategy, Component, HostBinding} from '@angular/core';

@Component({
  selector: 'c-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  @HostBinding('class') class = 'c-footer';
  constructor() {}
}
