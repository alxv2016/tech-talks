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
import {Observable} from 'rxjs';

@Component({
  selector: 'c-orbital-blur',
  templateUrl: './orbital-blur.component.html',
  styleUrls: ['./orbital-blur.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrbitalBlurComponent implements AfterViewInit {
  oribtalAnime!: GSAPTimeline;
  @Input() animeEvents!: Observable<boolean>;
  @HostBinding('class') class = 'c-orbital-blur';
  @ViewChild('orbitalOrb') orbitalOrb!: ElementRef;
  @ViewChildren('orbitalBlob', {read: ElementRef}) orbitalBlob!: QueryList<ElementRef>;
  constructor(private element: ElementRef, private render: Renderer2, private ngZone: NgZone) {}

  private initGSAP(): void {
    const orbitalBlobs = this.orbitalBlob.map((blob) => blob.nativeElement);

    this.oribtalAnime = gsap.timeline({
      repeat: -1,
      yoyo: true,
      yoyoEase: 'back',
      defaults: {
        duration: 2.25,
        transformOrigin: 'center',
      },
    });

    this.oribtalAnime
      .from(orbitalBlobs, {
        scale: 1.25,
        opacity: 0.125,
        rotate: -25,
        stagger: 0.125,
      })
      .from(
        this.orbitalOrb.nativeElement,
        {
          scale: 1.45,
          opacity: 0,
          ease: 'back',
        },
        0.24
      );
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initGSAP();
    });

    this.animeEvents.subscribe((bool) => {
      console.log(bool);
      bool ? this.oribtalAnime.play() : this.oribtalAnime.pause();
    });
  }
}
