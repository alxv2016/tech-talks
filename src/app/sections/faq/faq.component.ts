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
        title: 'How long is this Tech Talks session?',
        descr:
          'This session will be 1 hour 15 minutes long as we will be diving into Figma to design and prototype an app to learn the core features of Figma. You will have 15 minutes at the end for a Q and A session.',
      },
      {
        title: 'Do I need to install Figma?',
        descr:
          'Figma is cross platform and can also run in the web browser.  While you do not need to install Figma, we highly suggest that you do because it will run alot better than the web app.',
      },
      {
        title: 'What if I already know how to use Figma?',
        descr:
          'This session is geared towards designers who are new to Figma, however Tech Talks sessions are aim to combine development practices into design so you may still learn some new things.',
      },
      {
        title: "What if I can't join this session?",
        descr:
          "We know the seats are limited to 10 people, however we will be recording this session so if you couldn't attend you can still watch the recording and stay tuned for the next Tech Talks.",
      },
    ];
  }
}
