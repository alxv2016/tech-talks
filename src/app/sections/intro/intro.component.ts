import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
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
  selector: 'c-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements OnInit, AfterViewInit {
  siteContent: Content;
  app: any;

  @HostBinding('class') class = 'c-intro';
  @ViewChild('brandTrigger') brandTrigger!: ElementRef;
  @ViewChild('cardTrigger') cardTrigger!: ElementRef;
  @ViewChild('brandLogo') brandLogo!: ElementRef;
  @ViewChild('bolt') bolt!: ElementRef;
  @ViewChild('tech') tech!: ElementRef;
  @ViewChild('talks') talks!: ElementRef;
  @ViewChild('introContent') introContent!: ElementRef;
  @ViewChild('gradientContainer') gradientContainer!: ElementRef;
  @ViewChildren('cardReveal', {read: ElementRef}) cardReveal!: QueryList<ElementRef>;
  @ViewChildren('title', {read: ElementRef}) title!: QueryList<ElementRef>;
  constructor(
    private contentService: ContentService,
    private ngZone: NgZone,
    private element: ElementRef,
    private render: Renderer2
  ) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(PIXI);
  }

  ngOnInit(): void {
    this.contentService.siteContent$.subscribe((data) => {
      this.siteContent = data;
    });
  }

  initGsap() {
    const titles = this.title.map((title) => title.nativeElement);
    const cardReveals = this.cardReveal.map((rev) => rev.nativeElement);

    gsap.from(cardReveals, {
      opacity: 1,
      stagger: 0.125,
      scrollTrigger: {
        markers: false,
        trigger: this.cardTrigger.nativeElement,
        start: 'top center',
        end: '80% center',
        scrub: 0.45,
      },
    });

    const introReveal = gsap.timeline({
      scrollTrigger: {
        markers: false,
        trigger: this.brandTrigger.nativeElement,
        start: 'top 65%',
        end: '80% 65%',
        scrub: 0.45,
      },
    });

    introReveal
      .from(this.brandLogo.nativeElement, {
        scale: 0.95,
        opacity: 0,
      })
      .fromTo(
        this.bolt.nativeElement,
        {
          fill: '#FB3E54',
        },
        {
          fill: '#E0FB3E',
        }
      )
      .from(
        this.tech.nativeElement,
        {
          opacity: 0,
        },
        0.125
      )
      .from(
        this.talks.nativeElement,
        {
          opacity: 0,
        },
        0.4
      )
      .from(
        titles,
        {
          y: 40,
          opacity: 0,
          stagger: 0.145,
        },
        0.125
      );
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

    for (let i = 0; i < this.app.renderer.height / 20; i++) {
      const texture = PIXI.Texture.from('assets/gradient.png');
      const gradient = new PIXI.Sprite(texture);
      gradient.anchor.set(0.5);
      gradient.x = this.app.renderer.width / 2;
      gradient.width = this.app.renderer.width;
      gradient.height = 20;
      gradient.y = i * gradient.height;
      this.app.stage.addChild(gradient);
    }

    const tl = gsap.timeline({
      defaults: {
        stagger: {
          each: 0.0475,
          from: 'end',
        },
        ease: 'back',
        duration: 3,
        repeat: -1,
        yoyo: true,
        yoyoEase: true,
      },
    });

    tl.fromTo(
      this.app.stage.children,
      {
        pixi: {
          width: this.app.renderer.width / 16,
          alpha: 0.45,
        },
      },
      {
        pixi: {
          width: this.app.renderer.width / 2,
          alpha: 1,
        },
      }
    );
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.cardReveal.changes.subscribe((_) => {
        this.initGsap();
        this.initPixi();
      });
    });
  }
}
