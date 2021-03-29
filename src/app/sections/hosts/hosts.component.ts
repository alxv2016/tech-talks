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
import {UtilityService} from 'src/app/services/utility.service';

@Component({
  selector: 'c-hosts',
  templateUrl: './hosts.component.html',
  styleUrls: ['./hosts.component.scss'],
})
export class HostsComponent implements OnInit, AfterViewInit {
  @HostBinding('class') class = 'c-hosts';
  @ViewChildren('grad', {read: ElementRef}) grad!: QueryList<ElementRef>;
  constructor(private element: ElementRef, private render: Renderer2, private util: UtilityService) {}

  ngOnInit(): void {}

  initGsap(): void {
    const grads = this.grad.map((grad) => grad.nativeElement);
    gsap.fromTo(
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
