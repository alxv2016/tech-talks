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
  selector: 'c-figma',
  templateUrl: './figma.component.html',
  styleUrls: ['./figma.component.scss'],
})
export class FigmaComponent implements OnInit, AfterViewInit {
  @HostBinding('class') class = 'c-figma l-content--reveal';
  @HostBinding('style.--a-start') @Input() aStart: string = '0%';
  @HostBinding('style.--a-end') @Input() aEnd: string = '0%';
  @HostBinding('style.--b-start') @Input() bStart: string = '0%';
  @HostBinding('style.--b-end') @Input() bEnd: string = '0%';
  @ViewChild('sessionIntroTrigger') sessionIntroTrigger!: ElementRef;
  @ViewChild('figmaDemoTrigger') figmaDemoTrigger!: ElementRef;
  @ViewChild('figmaApp') figmaApp!: ElementRef;
  @ViewChild('figmaVideo') figmaVideo!: ElementRef;
  @ViewChild('features') features!: ElementRef;
  @ViewChildren('title', {read: ElementRef}) title!: QueryList<ElementRef>;
  constructor(private element: ElementRef, private render: Renderer2, private util: UtilityService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const titles = this.title.map((el) => el.nativeElement);

    gsap.from(titles, {
      y: 20,
      opacity: 0,
      stagger: 0.125,
      scrollTrigger: {
        markers: false,
        trigger: this.sessionIntroTrigger.nativeElement,
        start: 'top center',
        end: 'bottom center',
        scrub: 0.45,
        onUpdate: (self: any) => {
          const heroReveal = this.util.calculateScroll(self.progress, 16, 20);
          this.bStart = `${heroReveal.start}%`;
          this.bEnd = `${heroReveal.end}%`;
        },
      },
    });

    gsap.from(this.figmaApp.nativeElement, {
      y: 50,
      opacity: 0,
      scale: 0.94,
      scrollTrigger: {
        markers: false,
        trigger: this.figmaDemoTrigger.nativeElement,
        start: 'top center',
        end: 'bottom center',
        scrub: 0.45,
        onUpdate: (self: any) => {
          const heroReveal = this.util.calculateScroll(self.progress, 6);
          this.aStart = `${heroReveal.start}%`;
          this.aEnd = `${heroReveal.end}%`;
        },
        onEnter: ({isActive}) => {
          if (isActive) {
            this.figmaVideo.nativeElement.muted = true;
            this.figmaVideo.nativeElement.play();
            this.figmaVideo.nativeElement.addEventListener('ended', this.hideVideo);
          }
        },
      },
    });

    gsap.from(this.features.nativeElement, {
      y: 20,
      opacity: 0,
      scrollTrigger: {
        markers: false,
        trigger: this.figmaDemoTrigger.nativeElement,
        start: 'center center',
        end: 'bottom center',
        scrub: 0.45,
      },
    });
  }

  hideVideo(ev: any) {
    ev.target.removeEventListener('ended', this.hideVideo);
  }
}
