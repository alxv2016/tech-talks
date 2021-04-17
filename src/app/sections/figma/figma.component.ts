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
  selector: 'c-figma',
  templateUrl: './figma.component.html',
  styleUrls: ['./figma.component.scss'],
})
export class FigmaComponent implements OnInit, AfterViewInit {
  siteContent: Content;
  @HostBinding('class') class = 'c-figma';

  @ViewChild('autoLayoutTrigger') autoLayoutTrigger!: ElementRef;
  @ViewChild('autoLayout') autoLayout!: ElementRef;
  @ViewChild('autoLayoutVideo') autoLayoutVideo!: ElementRef;

  @ViewChild('variantsTrigger') variantsTrigger!: ElementRef;
  @ViewChild('variants') variants!: ElementRef;
  @ViewChild('variantsVideo') variantsVideo!: ElementRef;

  @ViewChild('prototypesTrigger') prototypesTrigger!: ElementRef;
  @ViewChild('prototypes') prototypes!: ElementRef;
  @ViewChild('prototypesVideo') prototypesVideo!: ElementRef;

  @ViewChild('introTrigger') introTrigger!: ElementRef;
  @ViewChildren('title', {read: ElementRef}) title!: QueryList<ElementRef>;
  constructor(private contentService: ContentService, private ngZone: NgZone) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {
    this.contentService.siteContent$.subscribe((data) => {
      this.siteContent = data;
    });
  }

  initGsap(): void {
    const titles = this.title.map((title) => title.nativeElement);

    gsap.from(this.autoLayout.nativeElement, {
      y: 40,
      opacity: 0,
      scrollTrigger: {
        markers: false,
        trigger: this.autoLayoutTrigger.nativeElement,
        start: 'top 80%',
        end: 'bottom 80%',
        scrub: 0.45,
        onEnter: ({isActive}) => {
          if (isActive) {
            this.autoLayoutVideo.nativeElement.muted = true;
            this.autoLayoutVideo.nativeElement.play();
            this.autoLayoutVideo.nativeElement.addEventListener('ended', this.hideVideo);
          }
        },
      },
    });

    gsap.from(this.variants.nativeElement, {
      y: 40,
      opacity: 0,
      scrollTrigger: {
        markers: false,
        trigger: this.variantsTrigger.nativeElement,
        start: 'top 80%',
        end: 'bottom 80%',
        scrub: 0.45,
        onEnter: ({isActive}) => {
          if (isActive) {
            this.variantsVideo.nativeElement.muted = true;
            this.variantsVideo.nativeElement.play();
            this.variantsVideo.nativeElement.addEventListener('ended', this.hideVideo);
          }
        },
      },
    });

    gsap.from(this.prototypes.nativeElement, {
      y: 40,
      opacity: 0,
      scrollTrigger: {
        markers: false,
        trigger: this.prototypesTrigger.nativeElement,
        start: 'top 80%',
        end: 'bottom 80%',
        scrub: 0.45,
        onEnter: ({isActive}) => {
          if (isActive) {
            this.prototypesVideo.nativeElement.muted = true;
            this.prototypesVideo.nativeElement.play();
            this.prototypesVideo.nativeElement.addEventListener('ended', this.hideVideo);
          }
        },
      },
    });

    gsap.from(titles, {
      y: 24,
      opacity: 0,
      stagger: 0.165,
      scrollTrigger: {
        markers: false,
        trigger: this.introTrigger.nativeElement,
        start: 'top 75%',
        end: 'bottom 75%',
        scrub: 0.45,
      },
    });
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initGsap();
    });
  }

  hideVideo(ev: any) {
    ev.target.removeEventListener('ended', this.hideVideo);
  }
}
