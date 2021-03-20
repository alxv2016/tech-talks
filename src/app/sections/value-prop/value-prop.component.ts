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

    gsap.from(valueProps, {
      scrollTrigger: {
        markers: false,
        trigger: this.element.nativeElement,
        start: '-80% center',
        end: 'bottom center',
        scrub: 0.45,
        onUpdate: (self: any) => {
          const heroReveal = this.util.calculateScroll(self.progress, 8, 16);
          this.aStart = `${heroReveal.start}%`;
          this.aEnd = `${heroReveal.end}%`;
        },
      },
      yPercent: 80,
      opacity: 0,
      scale: 0.98,
      stagger: 0.25,
    });
  }
}
