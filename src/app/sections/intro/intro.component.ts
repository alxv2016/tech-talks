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
  selector: 'c-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements OnInit, AfterViewInit {
  @HostBinding('class') class = 'c-intro l-content--reveal';
  @HostBinding('style.--a-start') @Input() aStart: string = '0%';
  @HostBinding('style.--a-end') @Input() aEnd: string = '0%';
  @HostBinding('style.--b-start') @Input() bStart: string = '0%';
  @HostBinding('style.--b-end') @Input() bEnd: string = '0%';
  @ViewChild('introCardTrigger') introCardTrigger!: ElementRef;
  @ViewChild('glitch') glitch!: ElementRef;
  @ViewChild('brandLogo') brandLogo!: ElementRef;
  @ViewChild('bolt') bolt!: ElementRef;
  @ViewChildren('introCard', {read: ElementRef}) introCard!: QueryList<ElementRef>;
  @ViewChildren('grad', {read: ElementRef}) grad!: QueryList<ElementRef>;
  @ViewChildren('introTitle', {read: ElementRef}) introTitle!: QueryList<ElementRef>;
  constructor(private element: ElementRef, private render: Renderer2, private util: UtilityService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const grads = this.grad.map((grad) => grad.nativeElement);
    const titles = this.introTitle.map((title) => title.nativeElement);

    gsap.fromTo(
      this.bolt.nativeElement,
      {
        fill: '#FB3E54',
      },
      {
        fill: '#E0FB3E',
        duration: 1.25,
        yoyo: true,
        repeat: -1,
      }
    );

    const introReveal = gsap.timeline({
      defaults: {},
      scrollTrigger: {
        markers: false,
        trigger: this.element.nativeElement,
        start: 'top center',
        end: 'center center',
        scrub: 0.45,
        onUpdate: (self: any) => {
          const heroReveal = this.util.calculateScroll(self.progress, 16, 20);
          this.bStart = `${heroReveal.start}%`;
          this.bEnd = `${heroReveal.end}%`;
        },
      },
    });

    introReveal
      .from(this.brandLogo.nativeElement, {
        scale: 0.94,
        opacity: 0,
      })
      .from(
        titles,
        {
          y: 20,
          opacity: 0,
          stagger: 0.125,
        },
        0.125
      );

    gsap.fromTo(
      this.glitch.nativeElement,
      {
        scale: 0.85,
        opacity: 0.25,
      },
      {
        scrollTrigger: {
          markers: false,
          trigger: this.introCardTrigger.nativeElement,
          start: 'top center',
          end: 'bottom center',
          scrub: 0.45,
          onUpdate: (self: any) => {
            const heroReveal = this.util.calculateScroll(self.progress, 4, 8);
            this.aStart = `${heroReveal.start}%`;
            this.aEnd = `${heroReveal.end}%`;
          },
        },
        scale: 1,
        opacity: 1,
      }
    );

    const glitch = gsap.timeline({
      defaults: {
        yoyo: true,
        yoyoEase: true,
        repeat: -1,
        ease: 'back',
        duration: 0.95,
      },
    });

    glitch.fromTo(
      grads,
      {
        xPercent: -18,
        opacity: 0.45,
      },
      {
        xPercent: 18,
        opacity: 1,
        stagger: 0.175,
      }
    );
  }
}
