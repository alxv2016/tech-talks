import {
  AfterViewInit,
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
import {Content} from 'src/app/services/models/content.interface';

@Component({
  selector: 'c-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit, AfterViewInit {
  expanded = false;
  @HostBinding('class') class = 'c-accordion';
  @Input() siteContent: Content;
  @ViewChildren('accordionHeader', {read: ElementRef}) accordionHeader!: QueryList<ElementRef>;
  @ViewChildren('accordionPanel', {read: ElementRef}) accordionPanel!: QueryList<ElementRef>;
  constructor(private element: ElementRef, private render: Renderer2) {}

  ngOnInit(): void {
    console.log(this.siteContent);
  }

  ngAfterViewInit(): void {
    this.initAccordion();
    // const headers = this.accordionHeader.map((header) => header.nativeElement);
    // const panels = this.accordionPanel.map((panel) => panel.nativeElement);
    // if (panels.length !== 0) {
    //   console.log(panels);
    //   panels.forEach((panel) => {
    //     this.render.setAttribute(panel, 'style', 'height: 0; visibility: hidden;');
    //   });
    // }
    // headers.forEach((header) => {
    //   this.render.setAttribute(header, 'aria-expanded', `${this.expanded}`);
    // });
  }

  async initAccordion() {
    if (this.siteContent.faq_panels.length !== 0) {
      const headers = this.accordionHeader.map((header) => header.nativeElement);
      const panels = this.accordionPanel.map((panel) => panel.nativeElement);
      headers.forEach((header) => {
        this.render.setAttribute(header, 'aria-expanded', `${this.expanded}`);
      });
      panels.forEach((panel) => {
        this.render.setAttribute(panel, 'style', 'height: 0; visibility: hidden;');
      });
      console.log(headers);
    }
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
