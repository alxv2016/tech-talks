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
  @HostBinding('style.--b-start') @Input() bStart: string = '0%';
  @HostBinding('style.--b-end') @Input() bEnd: string = '0%';
  @ViewChild('brandTrigger') brandTrigger!: ElementRef;
  @ViewChild('cardTrigger') cardTrigger!: ElementRef;
  @ViewChild('glitch') glitch!: ElementRef;
  @ViewChild('brandLogo') brandLogo!: ElementRef;
  @ViewChild('bolt') bolt!: ElementRef;
  @ViewChildren('introCard', {read: ElementRef}) introCard!: QueryList<ElementRef>;
  @ViewChildren('cardReveal', {read: ElementRef}) cardReveal!: QueryList<ElementRef>;
  @ViewChildren('grad', {read: ElementRef}) grad!: QueryList<ElementRef>;
  @ViewChildren('introTitle', {read: ElementRef}) introTitle!: QueryList<ElementRef>;
  constructor(private element: ElementRef, private render: Renderer2, private util: UtilityService) {}

  ngOnInit(): void {}
  //
  ngAfterViewInit(): void {
    const grads = this.grad.map((grad) => grad.nativeElement);
    const titles = this.introTitle.map((title) => title.nativeElement);
    const cards = this.introCard.map((card) => card.nativeElement);
    const cardReveals = this.cardReveal.map((rev) => rev.nativeElement);

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

    const cardReveal = gsap.timeline({
      scrollTrigger: {
        markers: false,
        trigger: this.cardTrigger.nativeElement,
        start: 'top center',
        end: '80% center',
        scrub: 0.45,
      },
    });

    cardReveal
      // .from(cards, {
      //   rotateY: '-14deg',
      //   rotateX: '14deg',
      //   y: -70,
      // })
      .from(cardReveals, {
        opacity: 1,
        stagger: 0.125,
      });

    const introReveal = gsap.timeline({
      scrollTrigger: {
        markers: false,
        trigger: this.brandTrigger.nativeElement,
        start: 'top 65%',
        end: '80% 65%',
        scrub: 0.45,
        onUpdate: (self: any) => {
          const heroReveal = this.util.calculateScroll(self.progress, 8, 20);
          this.bStart = `${heroReveal.start}%`;
          this.bEnd = `${heroReveal.end}%`;
        },
      },
    });

    introReveal
      .from(this.brandLogo.nativeElement, {
        scale: 0.95,
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

    const glitch = gsap.timeline({
      defaults: {
        yoyo: true,
        yoyoEase: true,
        repeat: -1,
        ease: 'back',
        duration: 1.95,
      },
    });

    glitch.fromTo(
      grads,
      {
        scaleX: 0.175,
        opacity: 0.25,
      },
      {
        scaleX: 1.25,
        opacity: 1,
        stagger: {
          each: 0.175,
          from: 'end',
        },
      }
    );
  }
}
