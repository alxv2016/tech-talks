import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  NgZone,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {ContentService} from 'src/app/services/content.service';
import {Content} from 'src/app/services/models/content.interface';
import {UtilityService} from 'src/app/services/utility.service';

@Component({
  selector: 'c-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit, AfterViewInit {
  siteContent: Content;
  @HostBinding('class') class = 'c-hero';
  @HostBinding('style.--a-start') @Input() aStart: string = '0%';
  @HostBinding('style.--a-end') @Input() aEnd: string = '0%';
  @ViewChildren('title', {read: ElementRef}) title!: QueryList<ElementRef>;
  @ViewChildren('grad', {read: ElementRef}) grad!: QueryList<ElementRef>;

  constructor(
    private element: ElementRef,
    private render: Renderer2,
    private util: UtilityService,
    private contentService: ContentService,
    private ngZone: NgZone
  ) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {
    this.render.addClass(this.element.nativeElement, 'l-content--hide');
    this.contentService.siteContent$.subscribe((data) => {
      this.siteContent = data;
    });
  }

  private initGsap() {
    const titles = this.title.map((title) => title.nativeElement);
    const grads = this.grad.map((grad) => grad.nativeElement);
    const glitch = gsap.timeline({
      defaults: {
        yoyo: true,
        yoyoEase: true,
        repeat: -1,
        duration: 3.95,
        ease: 'back',
      },
    });

    glitch.fromTo(
      grads,
      {
        xPercent: -58,
        opacity: 0.75,
        translateZ: 0,
      },
      {
        xPercent: 58,
        stagger: 0.125,
        translateZ: 0,
        opacity: 1,
      }
    );

    gsap.fromTo(
      titles,
      {
        yPercent: 0,
        textShadow: '0px 0px 0px rgba(251,62,84,0.75), 0px 0px 0px rgba(62,228,251,1)',
      },
      {
        yPercent: -30,
        textShadow: '28px 0px 0px rgba(251,62,84,0.75), -28px 0px 0px rgba(62,228,251,1)',
        duration: 4.75,
        stagger: 0.175,
        scrollTrigger: {
          markers: false,
          trigger: this.element.nativeElement,
          start: 'top top',
          end: '120% top',
          scrub: 0.45,
          onUpdate: (self: any) => {
            const heroReveal = this.util.calculateScroll(self.progress, 3, 20);
            this.aStart = `${heroReveal.start}%`;
            this.aEnd = `${heroReveal.end}%`;
          },
        },
      }
    );
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initGsap();
      gsap.delayedCall(1, () => {
        ScrollTrigger.refresh();
      });
    });
  }
}
