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
import {TechTalksCollection} from 'src/app/services/models/content.interface';

@Component({
  selector: 'c-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent implements OnInit, AfterViewInit {
  siteContent: TechTalksCollection;
  @HostBinding('class') class = 'c-experience';

  @ViewChild('testTrigger') testTrigger!: ElementRef;
  @ViewChild('sessionContent') sessionContent!: ElementRef;
  @ViewChild('testVideo') testVideo!: ElementRef;
  // @ViewChild('variantsTrigger') variantsTrigger!: ElementRef;
  // @ViewChild('variants') variants!: ElementRef;
  // @ViewChild('variantsVideo') variantsVideo!: ElementRef;

  // @ViewChild('prototypesTrigger') prototypesTrigger!: ElementRef;
  // @ViewChild('prototypes') prototypes!: ElementRef;
  // @ViewChild('prototypesVideo') prototypesVideo!: ElementRef;

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

    gsap.from(this.sessionContent.nativeElement, {
      y: 24,
      opacity: 0,
      stagger: 0.165,
      scrollTrigger: {
        markers: false,
        trigger: this.testTrigger.nativeElement,
        start: 'top 75%',
        end: 'bottom 75%',
        scrub: 0.45,
        onEnter: ({isActive}) => {
          if (isActive) {
            this.testVideo.nativeElement.muted = true;
            this.testVideo.nativeElement.play();
            this.testVideo.nativeElement.addEventListener('ended', this.hideVideo);
          }
        },
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
