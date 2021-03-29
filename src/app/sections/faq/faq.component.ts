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
import {AccordionComponent} from 'src/app/components/accordion/accordion.component';
import {UtilityService} from 'src/app/services/utility.service';

@Component({
  selector: 'c-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit, AfterViewInit {
  demoData: any = [];

  @HostBinding('class') class = 'c-faq l-content--reveal';
  @HostBinding('style.--a-start') @Input() aStart: string = '0%';
  @HostBinding('style.--a-end') @Input() aEnd: string = '0%';
  @HostBinding('style.--b-start') @Input() bStart: string = '0%';
  @HostBinding('style.--b-end') @Input() bEnd: string = '0%';
  @ViewChild('bolt') bolt!: ElementRef;
  @ViewChild('boltSpark1') boltSpark1!: ElementRef;
  @ViewChild('boltSpark2') boltSpark2!: ElementRef;
  @ViewChild('faqTitle') faqTitle!: ElementRef;
  @ViewChild('faqAccordion') faqAccordion!: ElementRef;
  constructor(private element: ElementRef, private render: Renderer2, private util: UtilityService) {}

  ngOnInit(): void {
    this.demoData = [
      {
        title: 'How long is this Tech Talks session?',
        descr:
          "This session will be 1 hour 15 minutes long as we will be collaboratively diving into Figma to design and prototype an app while learning Figma's core features. You will have 15 minutes at the end for a Q and A session.",
      },
      {
        title: 'Do I need to install Figma?',
        descr:
          'Figma is cross platform and can also run in the web browser. While you do not need to install Figma, we highly suggest that you do because it will run a lot better than the web app.',
      },
      {
        title: 'What if I already know how to use Figma?',
        descr:
          'This session is geared towards designers who are new to Figma, however Tech Talks sessions aim to combine development practices into design so you may still learn something new.',
      },
      {
        title: "What if I can't join this session?",
        descr:
          "We know the seats are limited to 10 people, so we will be recording the session. If you can't attend the live event, you can still watch the recording at any time and stay tuned for the next Tech Talks.",
      },
    ];
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
        }
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
    this.initBoltGsap();
  }

  // ngAfterViewInit(): void {
  //   const faqReveal = gsap.timeline({
  //     scrollTrigger: {
  //       markers: false,
  //       trigger: this.element.nativeElement,
  //       start: 'top 90%',
  //       end: 'bottom 90%',
  //       scrub: 0.45,
  //       onUpdate: (self: any) => {
  //         const heroReveal = this.util.calculateScroll(self.progress, 4, 8);
  //         this.aStart = `${heroReveal.start}%`;
  //         this.aEnd = `${heroReveal.end}%`;
  //       },
  //     },
  //   });

  //   faqReveal
  //     .from(this.faqTitle.nativeElement, {
  //       y: 40,
  //       opacity: 0,
  //     })
  //     .from(
  //       this.faqAccordion.nativeElement,
  //       {
  //         opacity: 0,
  //       },
  //       0.125
  //     );
  // }
}
