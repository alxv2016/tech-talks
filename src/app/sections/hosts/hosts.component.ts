import {AfterViewInit, Component, ElementRef, HostBinding, NgZone, OnInit, ViewChild} from '@angular/core';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {ContentService} from 'src/app/services/content.service';
import {TechTalksCollection} from 'src/app/services/models/content.interface';

@Component({
  selector: 'c-hosts',
  templateUrl: './hosts.component.html',
  styleUrls: ['./hosts.component.scss'],
})
export class HostsComponent implements OnInit, AfterViewInit {
  siteContent: TechTalksCollection;
  @HostBinding('class') class = 'c-hosts';
  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('glow') glow!: ElementRef;
  constructor(private contentService: ContentService, private ngZone: NgZone) {
    gsap.registerPlugin(ScrollTrigger);
  }

  private initGSAP(): void {
    const glowTL = gsap.timeline({
      scrollTrigger: {
        markers: false,
        trigger: this.trigger.nativeElement,
        start: 'top center',
        end: 'bottom center',
        scrub: 0.45,
      },
    });

    glowTL.from(this.glow.nativeElement, {
      opacity: 0,
      scale: 0.25,
      ease: 'back',
      duration: 2.5,
    });
  }

  ngOnInit(): void {
    this.contentService.siteContent$.subscribe((data) => {
      this.siteContent = data;
    });
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initGSAP();
    });
  }
}
