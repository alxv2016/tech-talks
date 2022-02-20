import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
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
  @HostBinding('style.--a-start') @Input() aStart: string = '0%';
  @HostBinding('style.--a-end') @Input() aEnd: string = '0%';

  @ViewChild('testTrigger') testTrigger!: ElementRef;
  @ViewChild('sessionContent') sessionContent!: ElementRef;
  @ViewChild('testVideo') testVideo!: ElementRef;
  @ViewChild('introTrigger') introTrigger!: ElementRef;
  @ViewChildren('title', {read: ElementRef}) title!: QueryList<ElementRef>;
  @ViewChild('vortexTrigger') vortexTrigger!: ElementRef;
  @ViewChild('experienceVortex') experienceVortex!: ElementRef;
  @ViewChildren('experienceVortexRing', {read: ElementRef}) experienceVortexRing!: QueryList<ElementRef>;
  constructor(private contentService: ContentService, private ngZone: NgZone, private render: Renderer2) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {
    this.contentService.siteContent$.subscribe((data) => {
      this.siteContent = data;
    });
  }

  initGsap(): void {
    const titles = this.title.map((title) => title.nativeElement);
    const vortexRings = this.experienceVortexRing.map((ring) => ring.nativeElement);
    this.render.addClass(this.experienceVortex.nativeElement, 'l-content--hide');

    const experienceTL = gsap.timeline({
      scrollTrigger: {
        markers: false,
        trigger: this.introTrigger.nativeElement,
        start: 'top center',
        end: 'bottom center',
        scrub: 0.45,
      },
    });

    experienceTL
      .from(vortexRings, {
        rotate: -360,
        scale: 0.65,
        opacity: 0,
        stagger: 0.125,
        transformOrigin: 'center center',
      })
      .from(
        titles,
        {
          y: 24,
          opacity: 0,
          stagger: 0.165,
        },
        0.45
      )
      .to(
        this.experienceVortex.nativeElement,
        {
          '--a-start': '60%',
          '--a-end': '200%',
          duration: 6,
        },
        0.25
      );

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
