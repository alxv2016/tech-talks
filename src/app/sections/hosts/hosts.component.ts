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
import {ContentService} from 'src/app/services/content.service';
import {Content} from 'src/app/services/models/content.interface';

@Component({
  selector: 'c-hosts',
  templateUrl: './hosts.component.html',
  styleUrls: ['./hosts.component.scss'],
})
export class HostsComponent implements OnInit, AfterViewInit {
  siteContent: Content;
  @HostBinding('class') class = 'c-hosts';
  @ViewChildren('grad', {read: ElementRef}) grad!: QueryList<ElementRef>;
  constructor(private element: ElementRef, private render: Renderer2, private contentService: ContentService) {}

  ngOnInit(): void {
    this.contentService.siteContent$.subscribe((data) => {
      this.siteContent = data;
    });
  }

  initGsap(): void {
    const grads = this.grad.map((grad) => grad.nativeElement);
    const glitch = gsap.timeline({
      defaults: {
        yoyo: true,
        yoyoEase: true,
        repeat: -1,
        ease: 'back',
        duration: 1.75,
      },
    });

    glitch.fromTo(
      grads,
      {
        scaleY: 0.125,
        opacity: 0.175,
      },
      {
        scaleY: 1.25,
        opacity: 1,
        stagger: {
          each: 0.175,
          from: 'start',
        },
        yoyo: true,
        yoyoEase: true,
        repeat: -1,
        ease: 'back',
        duration: 1.75,
      }
    );
  }

  ngAfterViewInit(): void {
    this.initGsap();
  }
}
