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
import {UtilityService} from 'src/app/services/utility.service';

@Component({
  selector: 'c-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit, AfterViewInit {
  @HostBinding('class') class = 'c-hero l-content--hide';
  @HostBinding('style.--a-start') @Input() aStart: string = '0%';
  @HostBinding('style.--a-end') @Input() aEnd: string = '0%';
  @ViewChild('heroTitle') heroTitle!: ElementRef;
  @ViewChildren('grad', {read: ElementRef}) grad!: QueryList<ElementRef>;

  constructor(private element: ElementRef, private render: Renderer2, private util: UtilityService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const heroTitle = this.heroTitle.nativeElement;
    const grads = this.grad.map((grad) => grad.nativeElement);

    gsap.fromTo(
      heroTitle,
      {
        yPercent: 0,
        textShadow: '0px 0px 0px rgba(251,62,84,0.75), 0px 0px 0px rgba(62,228,251,1)',
      },
      {
        yPercent: -30,
        textShadow: '28px 0px 0px rgba(251,62,84,0.75), -28px 0px 0px rgba(62,228,251,1)',
        duration: 4.75,
        scrollTrigger: {
          markers: false,
          trigger: this.element.nativeElement,
          start: 'top top',
          end: '+=240 top',
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
        duration: 4.75,
        ease: 'back',
      },
    });

    glitch.fromTo(
      grads,
      {
        xPercent: -58,
      },
      {
        xPercent: 58,
        stagger: 0.125,
      }
    );
  }
}
