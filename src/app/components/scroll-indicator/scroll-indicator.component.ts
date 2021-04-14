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

@Component({
  selector: 'c-scroll-indicator',
  templateUrl: './scroll-indicator.component.html',
  styleUrls: ['./scroll-indicator.component.scss'],
})
export class ScrollIndicatorComponent implements AfterViewInit {
  @HostBinding('class') class = 'c-scroll-indicator';
  @ViewChild('scrollIndicator') scrollIndicator!: ElementRef;
  constructor(private element: ElementRef, private render: Renderer2, private ngZone: NgZone) {
    gsap.registerPlugin(ScrollTrigger);
  }

  private initGsap(): void {
    const scrollIndicate = gsap.timeline({
      defaults: {
        ease: 'power3',
        duration: 4.4,
        repeat: -1,
        stagger: {
          each: 0.125,
          from: 'end',
        },
      },
    });

    scrollIndicate.fromTo(
      this.scrollIndicator.nativeElement,
      {
        yPercent: -100,
        scaleY: 1,
        opacity: 0,
      },
      {
        yPercent: 100,
        scaleY: 0.25,
        opacity: 1,
      }
    );
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initGsap();
      const tl = gsap.to(this.element.nativeElement, {
        ease: 'power1',
        duration: 0.25,
        yPercent: 100,
        opacity: 0,
        visibility: 'hidden',
      });
      tl.pause();

      const indicator = this.element.nativeElement;
      ScrollTrigger.create({
        onUpdate: (self: any) => {
          const scrollPos = self.scroller.pageYOffset;
          if (indicator) {
            const headerHeight = indicator.getBoundingClientRect().height;
            if (scrollPos >= headerHeight) {
              tl.play();
            } else {
              tl.reverse();
            }
          }
        },
      });
    });
  }
}
