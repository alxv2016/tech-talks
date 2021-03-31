import {Component, HostBinding, OnInit} from '@angular/core';

@Component({
  selector: 'c-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @HostBinding('class') class = 'c-footer';
  constructor() {}
}
