import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
  selector: 'c-hosts',
  templateUrl: './hosts.component.html',
  styleUrls: ['./hosts.component.scss'],
})
export class HostsComponent implements OnInit, AfterViewInit {
  @HostBinding('class') class = 'c-hosts l-content--reveal';
  @HostBinding('style.--a-start') @Input() aStart: string = '0%';
  @HostBinding('style.--a-end') @Input() aEnd: string = '0%';
  @HostBinding('style.--b-start') @Input() bStart: string = '0%';
  @HostBinding('style.--b-end') @Input() bEnd: string = '0%';
  @ViewChild('hostTitle') hostTitle!: ElementRef;
  @ViewChildren('grad', {read: ElementRef}) grad!: QueryList<ElementRef>;
  constructor(private element: ElementRef, private render: Renderer2, private util: UtilityService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const grads = this.grad.map((grad) => grad.nativeElement);

    gsap.from(this.hostTitle.nativeElement, {
      y: 20,
      opacity: 0,
      scrollTrigger: {
        markers: false,
        trigger: this.element.nativeElement,
        start: 'top center',
        end: 'bottom center',
        scrub: 0.45,
        onUpdate: (self: any) => {
          const heroReveal = this.util.calculateScroll(self.progress, 4, 8);
          this.aStart = `${heroReveal.start}%`;
          this.aEnd = `${heroReveal.end}%`;
          this.bStart = `${heroReveal.start}%`;
          this.bEnd = `${heroReveal.end}%`;
        },
      },
    });

    const glitch = gsap.timeline({
      defaults: {
        yoyo: true,
        yoyoEase: true,
        repeat: -1,
        ease: 'back',
        duration: 0.5,
      },
    });

    glitch.fromTo(
      grads,
      {
        yPercent: -8,
        opacity: 0.45,
      },
      {
        yPercent: 8,
        opacity: 1,
        stagger: {
          each: 0.125,
          from: 'start',
        },
      }
    );
  }
}
