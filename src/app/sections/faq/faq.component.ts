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
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AccordionComponent} from 'src/app/components/accordion/accordion.component';
import {ContentService} from 'src/app/services/content.service';
import {Content} from 'src/app/services/models/content.interface';
import {UtilityService} from 'src/app/services/utility.service';

@Component({
  selector: 'c-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit, AfterViewInit {
  private unsubscribe$ = new Subject();
  siteContent: Content;
  @HostBinding('class') class = 'c-faq';
  @ViewChild('bolt') bolt!: ElementRef;
  @ViewChild('boltSpark1') boltSpark1!: ElementRef;
  @ViewChild('boltSpark2') boltSpark2!: ElementRef;
  @ViewChild('faqAccordion') faqAccordion!: ElementRef;
  constructor(
    private element: ElementRef,
    private render: Renderer2,
    private contentService: ContentService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.contentService.siteContent$.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.siteContent = data;
    });
  }

  private initBoltGsap() {
    const bolt = gsap.timeline({
      defaults: {
        ease: 'back',
        repeat: -1,
        yoyo: true,
      },
    });

    bolt
      .fromTo(
        this.bolt.nativeElement,
        {
          strokeDasharray: 90,
          strokeDashoffset: 360,
          strokeWidth: 0.75,
          stroke: '#ffffff',
          opacity: 0,
        },
        {
          strokeDasharray: 180,
          strokeDashoffset: 0,
          duration: 0.75,
          stroke: '#ffffff',
          strokeWidth: 6,
          opacity: 1,
        }
      )
      .fromTo(
        this.boltSpark1.nativeElement,
        {
          strokeDasharray: 80,
          strokeDashoffset: 360,
          strokeWidth: 0.75,
          stroke: '#fb3e54',
          opacity: 0,
        },
        {
          strokeDasharray: 110,
          strokeDashoffset: 0,
          duration: 0.75,
          stroke: '#e0fb3e',
          strokeWidth: 6,
          opacity: 1,
        },
        0.125
      )
      .fromTo(
        this.boltSpark2.nativeElement,
        {
          strokeDasharray: 60,
          strokeDashoffset: 360,
          stroke: '#fb3e54',
          strokeWidth: 0.75,
          opacity: 0,
        },
        {
          strokeDasharray: 120,
          strokeDashoffset: 0,
          strokeWidth: 8,
          duration: 0.95,
          stroke: '#e0fb3e',
          opacity: 1,
        },
        0.145
      );
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initBoltGsap();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
