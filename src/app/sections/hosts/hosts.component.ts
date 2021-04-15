import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
import {Content} from 'src/app/services/models/content.interface';

@Component({
  selector: 'c-hosts',
  templateUrl: './hosts.component.html',
  styleUrls: ['./hosts.component.scss'],
})
export class HostsComponent implements OnInit, AfterViewInit {
  siteContent: Content;
  @HostBinding('class') class = 'c-hosts';
  @ViewChildren('grad', {read: ElementRef}) grad!: QueryList<ElementRef>;
  constructor(
    private element: ElementRef,
    private render: Renderer2,
    private contentService: ContentService,
    private ngZone: NgZone
  ) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {
    this.contentService.siteContent$.subscribe((data) => {
      this.siteContent = data;
      this.siteContent.host.forEach((d) => {
        const initials = d.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase();
        Object.assign(d, {initials});
      });
    });
  }

  initGsap(): void {
    const grads = this.grad.map((grad) => grad.nativeElement);

    const glitch = gsap.timeline({
      defaults: {
        yoyo: true,
        yoyoEase: true,
        repeat: -1,
        ease: 'back',
        duration: 1.75,
      },
    });

    glitch.fromTo(
      grads,
      {
        scaleY: 0.125,
        opacity: 0.175,
      },
      {
        scaleY: 1.25,
        opacity: 1,
        stagger: {
          each: 0.175,
          from: 'start',
        },
        yoyo: true,
        yoyoEase: true,
        repeat: -1,
        ease: 'back',
        duration: 1.75,
      }
    );

    glitch.pause();

    ScrollTrigger.create({
      trigger: this.element.nativeElement,
      markers: false,
      start: 'top bottom',
      end: 'bottom bottom',
      onEnter: () => {
        glitch.play();
      },
      onLeaveBack: () => {
        glitch.pause();
      },
    });
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initGsap();
    });
  }
}
