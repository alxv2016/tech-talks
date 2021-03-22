import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ValuePropComponent} from './value-prop/value-prop.component';
import {IntroComponent} from './intro/intro.component';
import {FigmaComponent} from './figma/figma.component';
import {HostsComponent} from './hosts/hosts.component';
import {FaqComponent} from './faq/faq.component';

@NgModule({
  declarations: [ValuePropComponent, IntroComponent, FigmaComponent, HostsComponent, FaqComponent],
  exports: [ValuePropComponent, IntroComponent, FigmaComponent, HostsComponent, FaqComponent],
  imports: [CommonModule],
})
export class SectionsModule {}
