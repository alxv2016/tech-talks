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
  selector: 'c-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements AfterViewInit {
  @HostBinding('class') class = 'c-hero';
  // @HostBinding('style.--a-start') @Input() aStart: string = '0%';
  // @HostBinding('style.--a-end') @Input() aEnd: string = '0%';
  // @HostBinding('style.--b-start') @Input() bStart: string = '0%';
  // @HostBinding('style.--b-end') @Input() bEnd: string = '0%';
  // @ViewChild('heroImage') heroImage!: ElementRef;
  @ViewChildren('grad', {read: ElementRef}) grad!: QueryList<ElementRef>;

  constructor(private element: ElementRef, private render: Renderer2, private util: UtilityService) {}

  ngAfterViewInit(): void {
    const grads = this.grad.map((grad) => grad.nativeElement);

    gsap.fromTo(
      grads,
      {
        xPercent: -90,
      },
      {
        xPercent: 90,
        stagger: 0.25,
        yoyo: true,
        repeat: -1,
      }
    );
  }
}
