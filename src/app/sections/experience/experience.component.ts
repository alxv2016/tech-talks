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
import {Subject} from 'rxjs';
import {ContentService} from 'src/app/services/content.service';
import {TechTalksCollection} from 'src/app/services/models/content.interface';

@Component({
  selector: 'c-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent implements OnInit, AfterViewInit {
  siteContent: TechTalksCollection;
  scrollTriggerEvents: Subject<boolean> = new Subject<boolean>();
  @HostBinding('class') class = 'c-experience';
  @HostBinding('style.--a-start') @Input() aStart: string = '0%';
  @HostBinding('style.--a-end') @Input() aEnd: string = '0%';
  //@ViewChild('bolt') bolt!: ElementRef;
  @ViewChild('experienceTrigger') experienceTrigger!: ElementRef;
  @ViewChild('sessionContent') sessionContent!: ElementRef;
  @ViewChild('testVideo') testVideo!: ElementRef;
  @ViewChild('introTrigger') introTrigger!: ElementRef;
  @ViewChildren('title', {read: ElementRef}) title!: QueryList<ElementRef>;
  @ViewChild('vortexTrigger') vortexTrigger!: ElementRef;
  @ViewChild('experienceVortex') experienceVortex!: ElementRef;
  @ViewChildren('experienceVortexRing', {read: ElementRef}) experienceVortexRing!: QueryList<ElementRef>;
  @ViewChildren('bolt', {read: ElementRef}) bolt!: QueryList<ElementRef>;
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
    const bolts = this.bolt.map((b) => b.nativeElement);
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
        yPercent: 10,
        opacity: 0,
        stagger: 0.125,
        duration: 3,
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

    const sessionTL = gsap.timeline({
      scrollTrigger: {
        markers: false,
        trigger: this.experienceTrigger.nativeElement,
        start: 'top 55%',
        end: 'bottom 55%',
        scrub: 0.45,
        onLeave: () => {
          this.scrollTriggerEvents.next(false);
          this.scrollTriggerEvents.asObservable();
        },
        onLeaveBack: () => {
          this.scrollTriggerEvents.next(true);
        },
        onEnterBack: () => {
          this.scrollTriggerEvents.next(true);
        },
      },
    });

    sessionTL
      .from(this.sessionContent.nativeElement, {
        y: 24,
        opacity: 0,
        stagger: 0.165,
      })
      .from(
        bolts,
        {
          opacity: 0,
          scale: 0.125,
          stagger: 0.85,
          transformOrigin: 'center',
          duration: 3,
        },
        0.25
      );

    // Set a delay after 1 second to refresh scrollTrigger instance
    gsap.delayedCall(1, () => {
      ScrollTrigger.refresh();
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
