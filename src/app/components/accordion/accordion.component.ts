import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import {forkJoin} from 'rxjs';
import {TechTalksCollection} from 'src/app/services/models/content.interface';

@Component({
  selector: 'c-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit, AfterViewInit {
  expanded = false;
  @HostBinding('class') class = 'c-accordion';
  @Input() siteContent: TechTalksCollection;
  @ViewChildren('accordionHeader', {read: ElementRef}) accordionHeader!: QueryList<ElementRef>;
  @ViewChildren('accordionPanel', {read: ElementRef}) accordionPanel!: QueryList<ElementRef>;
  constructor(private element: ElementRef, private render: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initAccordion();
  }

  private initAccordion() {
    this.accordionHeader.changes.subscribe((_) => {
      const headers = this.accordionHeader.map((header) => header.nativeElement);
      headers.forEach((header) => {
        this.render.setAttribute(header, 'aria-expanded', `${this.expanded}`);
      });
    });
    this.accordionPanel.changes.subscribe((_) => {
      const panels = this.accordionPanel.map((panel) => panel.nativeElement);
      panels.forEach((panel) => {
        this.render.setAttribute(panel, 'style', 'height: 0; visibility: hidden;');
      });
    });
  }

  togglePanel(ev: any, i: number): void {
    const panels = this.accordionPanel.map((panel) => panel.nativeElement);
    const panelHeight = panels[i].scrollHeight;
    if (ev.target.getAttribute('aria-expanded') === 'true') {
      this.render.setAttribute(ev.target, 'aria-expanded', `${this.expanded}`);
      this.render.removeClass(ev.target, 'is-opened');
      this.render.setAttribute(panels[i], 'style', 'height: 0; visibility: hidden;');
    } else {
      this.render.setAttribute(ev.target, 'aria-expanded', `${!this.expanded}`);
      this.render.addClass(ev.target, 'is-opened');
      this.render.setAttribute(panels[i], 'style', `height: ${panelHeight}px; visibility: visible;`);
    }
  }
}
