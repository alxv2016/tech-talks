import {
  AfterViewInit,
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
import {TechTalksCollection} from 'src/app/services/models/content.interface';

@Component({
  selector: 'c-value-prop',
  templateUrl: './value-prop.component.html',
  styleUrls: ['./value-prop.component.scss'],
})
export class ValuePropComponent implements OnInit, AfterViewInit {
  siteContent: TechTalksCollection;

  @HostBinding('class') class = 'c-value-prop';
  @HostBinding('style.--a-start') @Input() aStart: string = '0%';
  @HostBinding('style.--a-end') @Input() aEnd: string = '0%';
  @ViewChild('valueProps') valueProps!: ElementRef;
  @ViewChildren('valueProp', {read: ElementRef}) valueProp!: QueryList<ElementRef>;
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
    });
  }

  initGsap(): void {
    const valueProps = this.valueProp.map((value) => value.nativeElement);
    this.render.addClass(this.element.nativeElement, 'l-content--reveal');

    const valueTL = gsap.timeline({
      scrollTrigger: {
        markers: false,
        trigger: this.element.nativeElement,
        start: 'top center',
        end: '120% center',
        scrub: 0.75,
      },
    });

    valueTL
      .to(this.element.nativeElement, {
        '--a-start': '60%',
        '--a-end': '200%',
        duration: 3,
      })
      .fromTo(
        valueProps,
        {
          y: 36,
          opacity: 0,
          textShadow: '8px 0px 0px rgba(251,62,84,0.75), -8px 0px 0px rgba(62,228,251,0.75)',
        },
        {
          y: 0,
          opacity: 1,
          textShadow: '0px 0px 0px rgba(251,62,84,0.75), 0px 0px 0px rgba(62,228,251,0.75)',
          stagger: 0.275,
        },
        0.275
      );

    const hideContents = gsap.timeline({
      scrollTrigger: {
        markers: false,
        trigger: this.element.nativeElement,
        start: '122% center',
        end: '180% center',
        scrub: 0.45,
      },
    });

    hideContents
      .to(valueProps, {
        textShadow: '4px 0px 0px rgba(251,62,84,0.75), -4px 0px 0px rgba(62,228,251,0.75)',
        stagger: 0.175,
      })
      .to(
        this.valueProps.nativeElement,
        {
          opacity: 0,
          y: -40,
          duration: 3,
        },
        0
      );
  }

  ngAfterViewInit(): void {
    this.valueProp.changes.subscribe((_) => {
      this.ngZone.runOutsideAngular(() => {
        this.initGsap();
      });
    });
  }
}
