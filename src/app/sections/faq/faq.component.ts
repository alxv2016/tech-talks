import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {gsap} from 'gsap';
import {UtilityService} from 'src/app/services/utility.service';

@Component({
  selector: 'c-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
  demoData: any = [];

  @HostBinding('class') class = 'c-intro l-content--reveal';
  @HostBinding('style.--a-start') @Input() aStart: string = '0%';
  @HostBinding('style.--a-end') @Input() aEnd: string = '0%';
  @HostBinding('style.--b-start') @Input() bStart: string = '0%';
  @HostBinding('style.--b-end') @Input() bEnd: string = '0%';
  @ViewChild('brandTrigger') brandTrigger!: ElementRef;
  @ViewChildren('introTitle', {read: ElementRef}) introTitle!: QueryList<ElementRef>;
  constructor(private element: ElementRef, private render: Renderer2, private util: UtilityService) {}

  ngOnInit(): void {
    this.demoData = [
      {
        title: 'title 1',
        descr: 'You could write the de-sugared version directly like so:',
      },
      {
        title: 'title 2',
        descr: 'You could write the de-sugared version directly like so:',
      },
      {
        title: 'title 3',
        descr: 'You could write the de-sugared version directly like so:',
      },
      {
        title: 'title 4',
        descr: 'You could write the de-sugared version directly like so:',
      },
    ];
  }
}
