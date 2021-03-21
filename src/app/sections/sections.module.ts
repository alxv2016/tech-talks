import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ValuePropComponent} from './value-prop/value-prop.component';
import {IntroComponent} from './intro/intro.component';
import {FigmaComponent} from './figma/figma.component';
import {HostsComponent} from './hosts/hosts.component';

@NgModule({
  declarations: [ValuePropComponent, IntroComponent, FigmaComponent, HostsComponent],
  exports: [ValuePropComponent, IntroComponent, FigmaComponent, HostsComponent],
  imports: [CommonModule],
})
export class SectionsModule {}
