import {Component, Inject, OnInit} from '@angular/core';
import {HotToastRef} from '@ngneat/hot-toast';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  constructor(@Inject(HotToastRef) public message: HotToastRef<any>) {}

  ngOnInit(): void {
    console.log(this.message.data.message);
  }
}
