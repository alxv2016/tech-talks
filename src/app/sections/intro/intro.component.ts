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
  @HostBinding('class') class = 'c-intro';
  @ViewChild('brandTrigger') brandTrigger!: ElementRef;
  @ViewChild('cardTrigger') cardTrigger!: ElementRef;
  @ViewChild('glitch') glitch!: ElementRef;
  @ViewChild('brandLogo') brandLogo!: ElementRef;
  @ViewChild('bolt') bolt!: ElementRef;
  @ViewChild('introContent') introContent!: ElementRef;
  @ViewChildren('introCard', {read: ElementRef}) introCard!: QueryList<ElementRef>;
  @ViewChildren('cardReveal', {read: ElementRef}) cardReveal!: QueryList<ElementRef>;
  @ViewChildren('grad', {read: ElementRef}) grad!: QueryList<ElementRef>;
  @ViewChildren('introTitle', {read: ElementRef}) introTitle!: QueryList<ElementRef>;
  constructor(private element: ElementRef, private render: Renderer2, private util: UtilityService) {}

  ngOnInit(): void {}
  //

  initGsap() {
    const grads = this.grad.map((grad) => grad.nativeElement);
    const titles = this.introTitle.map((title) => title.nativeElement);
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

    gsap.from(cardReveals, {
      opacity: 1,
      stagger: 0.125,
      scrollTrigger: {
        markers: false,
        trigger: this.cardTrigger.nativeElement,
        start: 'top center',
        end: '80% center',
        scrub: 0.45,
      },
    });

    const introReveal = gsap.timeline({
      scrollTrigger: {
        markers: false,
        trigger: this.brandTrigger.nativeElement,
        start: 'top 65%',
        end: '80% 65%',
        scrub: 0.45,
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

    gsap.fromTo(
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
        yoyo: true,
        yoyoEase: true,
        repeat: -1,
        ease: 'back',
        duration: 1.95,
      }
    );
  }

  ngAfterViewInit(): void {
    this.initGsap();
  }
}
