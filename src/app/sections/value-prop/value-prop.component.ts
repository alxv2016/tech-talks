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
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {Observable} from 'rxjs';
import {ContentService} from 'src/app/services/content.service';
import {Content} from 'src/app/services/models/content.interface';
import {UtilityService} from 'src/app/services/utility.service';

@Component({
  selector: 'c-value-prop',
  templateUrl: './value-prop.component.html',
  styleUrls: ['./value-prop.component.scss'],
})
export class ValuePropComponent implements OnInit, AfterViewInit {
  siteContent: Content;

  @HostBinding('class') class = 'c-value-prop';
  @HostBinding('style.--a-start') @Input() aStart: string = '0%';
  @HostBinding('style.--a-end') @Input() aEnd: string = '0%';
  @ViewChildren('valueProp', {read: ElementRef}) valueProp!: QueryList<ElementRef>;
  constructor(
    private element: ElementRef,
    private render: Renderer2,
    private util: UtilityService,
    private contentService: ContentService
  ) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {
    this.contentService.siteContent$.subscribe((data) => {
      this.siteContent = data;
    });
  }

  initGsap(): void {
    const valueProps = this.valueProp.map((value) => value.nativeElement);
    this.render.addClass(this.element.nativeElement, 'l-content--reveal');

    gsap.fromTo(
      valueProps,
      {
        y: 46,
        opacity: 0,
        textShadow: '18px 0px 0px rgba(251,62,84,0.75), -18px 0px 0px rgba(62,228,251,0.75)',
      },
      {
        scrollTrigger: {
          markers: false,
          trigger: this.element.nativeElement,
          start: 'top center',
          end: '120% center',
          scrub: 0.75,
          onUpdate: (self: any) => {
            const heroReveal = this.util.calculateScroll(self.progress, 6, 24);
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

    gsap.fromTo(
      valueProps,
      {
        textShadow: '0px 0px 0px rgba(251,62,84,0.75), 0px 0px 0px rgba(62,228,251,0.75)',
        opacity: 1,
      },
      {
        opacity: 0,
        textShadow: '4px 0px 0px rgba(251,62,84,0.75), -4px 0px 0px rgba(62,228,251,0.75)',
        stagger: 0.175,
        scrollTrigger: {
          markers: false,
          trigger: this.element.nativeElement,
          start: 'bottom center',
          end: '160% center',
          scrub: 0.75,
        },
      }
    );
  }

  ngAfterViewInit(): void {
    this.valueProp.changes.subscribe((_) => {
      this.initGsap();
      ScrollTrigger.refresh();
    });
  }
}
