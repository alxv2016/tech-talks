import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'c-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss'],
})
export class WarningComponent implements OnInit {
  @HostBinding('class') class = 'c-warning';
  @Input() warningMsg: string;
  constructor() {}
  ngOnInit(): void {}
}
