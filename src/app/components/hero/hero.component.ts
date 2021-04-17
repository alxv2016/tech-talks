import {
  AfterContentInit,
  AfterViewChecked,
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
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {PixiPlugin} from 'gsap/PixiPlugin';
import * as PIXI from 'pixi.js';
import {ContentService} from 'src/app/services/content.service';
import {Content} from 'src/app/services/models/content.interface';

@Component({
  selector: 'c-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit, AfterViewInit {
  siteContent: Content;
  app: any;
  @HostBinding('class') class = 'c-hero';
  @HostBinding('style.--a-start') @Input() aStart: string = '0%';
  @HostBinding('style.--a-end') @Input() aEnd: string = '0%';
  @ViewChild('gradientContainer') gradientContainer!: ElementRef;
  @ViewChildren('title', {read: ElementRef}) title!: QueryList<ElementRef>;

  constructor(
    private element: ElementRef,
    private render: Renderer2,
    private contentService: ContentService,
    private ngZone: NgZone
  ) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(PIXI);
  }

  ngOnInit(): void {
    this.render.addClass(this.element.nativeElement, 'l-content--hide');
    this.contentService.siteContent$.subscribe((data) => {
      this.siteContent = data;
    });
  }

  private initGsap(): void {
    const titles = this.title.map((title) => title.nativeElement);
    const heroTL = gsap.timeline({
      scrollTrigger: {
        markers: false,
        trigger: this.element.nativeElement,
        start: 'top top',
        end: '120% top',
        scrub: 0.45,
      },
    });

    heroTL
      .fromTo(
        titles,
        {
          yPercent: 0,
          textShadow: '0px 0px 0px rgba(251,62,84,0.95), 0px 0px 0px rgba(62,228,251,1)',
        },
        {
          yPercent: -30,
          textShadow: '8px 0px 0px rgba(251,62,84,0.95), -8px 0px 0px rgba(62,228,251,1)',
          duration: 4.75,
          stagger: 0.175,
        }
      )
      .to(
        this.element.nativeElement,
        {
          '--a-start': '60%',
          '--a-end': '200%',
          duration: 6,
        },
        0
      );

    gsap.delayedCall(1, () => {
      ScrollTrigger.refresh();
    });
  }

  private initPixi(): void {
    this.app = new PIXI.Application({
      height: 800,
      width: 800,
      antialias: true,
      transparent: true,
    });
    this.render.appendChild(this.gradientContainer.nativeElement, this.app.view);
    this.app.ticker.stop();
    gsap.ticker.add(() => {
      this.app.ticker.update();
    });

    this.app.renderer.autoResize = true;
    this.render.setStyle(this.app.renderer.view, 'height', '100%');
    this.render.setStyle(this.app.renderer.view, 'width', '100%');

    for (let i = 0; i < this.app.renderer.height / 40; i++) {
      const texture = PIXI.Texture.from('assets/gradient.png');
      const gradient = new PIXI.Sprite(texture);
      gradient.anchor.set(0.5);
      gradient.x = this.app.renderer.width / 2;
      gradient.width = this.app.renderer.width;
      gradient.height = 40;
      gradient.y = i * gradient.height;
      this.app.stage.addChild(gradient);
    }

    const tl = gsap.timeline({
      defaults: {
        stagger: {
          each: 0.0675,
          from: 'end',
        },
        ease: 'back',
        duration: 4,
        repeat: -1,
        yoyo: true,
        yoyoEase: true,
      },
    });

    tl.fromTo(
      this.app.stage.children,
      {
        pixi: {
          x: -100,
        },
      },
      {
        pixi: {
          x: 900,
        },
      }
    );
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initGsap();
      this.initPixi();
    });
  }
}
