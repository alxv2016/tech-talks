import {Component, HostBinding, Inject, OnInit} from '@angular/core';

@Component({
  selector: 'c-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  @HostBinding('class') class = 'c-dialog';
  constructor() {}

  ngOnInit(): void {}
}
