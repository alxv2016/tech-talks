import {Component, HostBinding, OnInit} from '@angular/core';

@Component({
  selector: 'c-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit {
  @HostBinding('class') class = 'c-accordion';
  constructor() {}

  ngOnInit(): void {}
}
