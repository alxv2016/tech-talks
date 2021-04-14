import {AfterViewInit, Component, ElementRef, HostBinding, NgZone, OnInit, Renderer2, ViewChild} from '@angular/core';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

@Component({
  selector: 'c-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit {
  @HostBinding('class') class = 'header';
  @ViewChild('header') header!: ElementRef;
  constructor(private element: ElementRef, private render: Renderer2, private ngZone: NgZone) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const headerNav = this.element.nativeElement;
      ScrollTrigger.create({
        onUpdate: (self: any) => {
          const scrollDirection = self.direction;
          const scrollPos = self.scroller.pageYOffset;
          let scrollingDown = false;
          scrollDirection === 1 ? (scrollingDown = true) : (scrollingDown = false);
          if (headerNav) {
            const headerHeight = headerNav.getBoundingClientRect().height;
            if (scrollPos >= headerHeight) {
              scrollingDown
                ? this.render.setAttribute(headerNav, 'data-state', 'hidden')
                : this.render.removeAttribute(headerNav, 'data-state');
            }
          }
        },
      });
    });
  }
}
