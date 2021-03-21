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
  selector: 'c-value-prop',
  templateUrl: './value-prop.component.html',
  styleUrls: ['./value-prop.component.scss'],
})
export class ValuePropComponent implements OnInit, AfterViewInit {
  @HostBinding('class') class = 'c-value-prop l-content--reveal';
  @HostBinding('style.--a-start') @Input() aStart: string = '0%';
  @HostBinding('style.--a-end') @Input() aEnd: string = '0%';
  @ViewChildren('valueProp', {read: ElementRef}) valueProp!: QueryList<ElementRef>;
  constructor(private element: ElementRef, private render: Renderer2, private util: UtilityService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const valueProps = this.valueProp.map((value) => value.nativeElement);

    gsap.fromTo(
      valueProps,
      {
        y: 90,
        opacity: 0,
        textShadow: '18px 0px 0px rgba(251,62,84,0.75), -18px 0px 0px rgba(62,228,251,0.75)',
      },
      {
        scrollTrigger: {
          markers: false,
          trigger: this.element.nativeElement,
          start: '-=400 center',
          end: 'bottom center',
          scrub: 0.75,
          onUpdate: (self: any) => {
            const heroReveal = this.util.calculateScroll(self.progress, 4, 20);
            this.aStart = `${heroReveal.start}%`;
            this.aEnd = `${heroReveal.end}%`;
          },
        },
        y: 0,
        opacity: 1,
        textShadow: '0px 0px 0px rgba(251,62,84,0.75), 0px 0px 0px rgba(62,228,251,0.75)',
        stagger: 0.175,
      }
    );
  }
}
