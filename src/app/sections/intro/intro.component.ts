import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  NgZone,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {ContentService} from 'src/app/services/content.service';
import {Content} from 'src/app/services/models/content.interface';

@Component({
  selector: 'c-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements OnInit, AfterViewInit {
  siteContent: Content;

  @HostBinding('class') class = 'c-intro';
  @ViewChild('brandTrigger') brandTrigger!: ElementRef;
  @ViewChild('cardTrigger') cardTrigger!: ElementRef;
  @ViewChild('brandLogo') brandLogo!: ElementRef;
  @ViewChild('bolt') bolt!: ElementRef;
  @ViewChild('tech') tech!: ElementRef;
  @ViewChild('talks') talks!: ElementRef;
  @ViewChild('introContent') introContent!: ElementRef;
  @ViewChildren('cardReveal', {read: ElementRef}) cardReveal!: QueryList<ElementRef>;
  @ViewChildren('grad', {read: ElementRef}) grad!: QueryList<ElementRef>;
  @ViewChildren('title', {read: ElementRef}) title!: QueryList<ElementRef>;
  constructor(private contentService: ContentService, private ngZone: NgZone) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {
    this.contentService.siteContent$.subscribe((data) => {
      this.siteContent = data;
    });
  }

  initGsap() {
    const grads = this.grad.map((grad) => grad.nativeElement);
    const titles = this.title.map((title) => title.nativeElement);
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
        this.tech.nativeElement,
        {
          opacity: 0,
        },
        0.125
      )
      .from(
        this.talks.nativeElement,
        {
          opacity: 0,
        },
        0.4
      )
      .from(
        titles,
        {
          y: 40,
          opacity: 0,
          stagger: 0.145,
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

  ngAfterViewInit(): void {
    this.cardReveal.changes.subscribe((_) => {
      this.ngZone.runOutsideAngular(() => {
        this.initGsap();
      });
    });
  }
}
