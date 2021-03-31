import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
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
  @ViewChild('figmaDemoTrigger') figmaDemoTrigger!: ElementRef;
  @ViewChild('figmaApp') figmaApp!: ElementRef;
  @ViewChild('figmaVideo') figmaVideo!: ElementRef;
  @ViewChild('introCopy') introCopy!: ElementRef;
  @ViewChild('sessionTrigger') sessionTrigger!: ElementRef;
  @ViewChildren('title', {read: ElementRef}) title!: QueryList<ElementRef>;
  constructor(private contentService: ContentService) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {
    this.contentService.siteContent$.subscribe((data) => {
      this.siteContent = data;
    });
  }

  initGsap(): void {
    const titles = this.title.map((el) => el.nativeElement);
    const sessionReveal = gsap.timeline({
      scrollTrigger: {
        markers: false,
        trigger: this.sessionTrigger.nativeElement,
        start: 'top 60%',
        end: '70% 60%',
        scrub: 0.45,
        onEnter: ({isActive}) => {
          if (isActive) {
            this.figmaVideo.nativeElement.muted = true;
            this.figmaVideo.nativeElement.play();
            this.figmaVideo.nativeElement.addEventListener('ended', this.hideVideo);
          }
        },
      },
    });

    sessionReveal
      .from(titles, {
        y: 40,
        opacity: 0,
        stagger: 0.145,
      })
      .from(
        this.figmaApp.nativeElement,
        {
          y: 40,
          opacity: 0,
          scale: 0.96,
        },
        0.125
      )
      .from(
        this.introCopy.nativeElement,
        {
          opacity: 0,
        },
        0.145
      );
  }

  ngAfterViewInit(): void {
    this.initGsap();
  }

  hideVideo(ev: any) {
    ev.target.removeEventListener('ended', this.hideVideo);
  }
}
