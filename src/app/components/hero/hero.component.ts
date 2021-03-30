import {
  AfterViewInit,
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
import {Observable} from 'rxjs';
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
  @HostBinding('class') class = 'c-hero l-content--hide';
  @HostBinding('style.--a-start') @Input() aStart: string = '0%';
  @HostBinding('style.--a-end') @Input() aEnd: string = '0%';
  @ViewChildren('heroTitle', {read: ElementRef}) heroTitle!: QueryList<ElementRef>;
  @ViewChildren('grad', {read: ElementRef}) grad!: QueryList<ElementRef>;

  constructor(
    private element: ElementRef,
    private render: Renderer2,
    private util: UtilityService,
    private contentService: ContentService
  ) {}

  ngOnInit(): void {
    this.contentService.siteContent$.subscribe((data) => {
      this.siteContent = data;
    });
  }

  private initGsap() {
    const heroTitles = this.heroTitle.map((title) => title.nativeElement);
    const grads = this.grad.map((grad) => grad.nativeElement);

    gsap.fromTo(
      heroTitles,
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
      },
      {
        xPercent: 58,
        stagger: 0.125,
        opacity: 1,
      }
    );
  }

  ngAfterViewInit(): void {
    this.initGsap();
  }
}
