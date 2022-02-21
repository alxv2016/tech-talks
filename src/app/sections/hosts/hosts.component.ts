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
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {PixiPlugin} from 'gsap/PixiPlugin';
import * as PIXI from 'pixi.js';
import {ContentService} from 'src/app/services/content.service';
import {TechTalksCollection} from 'src/app/services/models/content.interface';

@Component({
  selector: 'c-hosts',
  templateUrl: './hosts.component.html',
  styleUrls: ['./hosts.component.scss'],
})
export class HostsComponent implements OnInit, AfterViewInit {
  siteContent: TechTalksCollection;
  app: any;
  @HostBinding('class') class = 'c-hosts';
  @ViewChild('gradientContainer') gradientContainer!: ElementRef;
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
    this.contentService.siteContent$.subscribe((data) => {
      this.siteContent = data;
    });
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.app = new PIXI.Application({
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

      for (let i = 0; i < this.app.renderer.width / 18; i++) {
        const texture = PIXI.Texture.from('assets/gradient2.png');
        const gradient = new PIXI.Sprite(texture);
        gradient.anchor.set(0.5);
        gradient.y = this.app.renderer.height / 2;
        gradient.height = this.app.renderer.height;
        gradient.width = 18;
        gradient.x = i * gradient.width;
        this.app.stage.addChild(gradient);
      }

      const tl = gsap.timeline({
        defaults: {
          stagger: {
            each: 0.0125,
            from: 'center',
          },
          ease: 'back',
          duration: 6,
          repeat: -1,
          yoyo: true,
          yoyoEase: 'back',
        },
      });

      tl.fromTo(
        this.app.stage.children,
        {
          pixi: {
            height: 40,
            alpha: 0.125,
          },
        },
        {
          pixi: {
            height: this.app.renderer.height / 1.25,
            alpha: 1,
          },
        }
      );
    });
  }
}
