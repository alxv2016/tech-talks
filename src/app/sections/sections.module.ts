import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ValuePropComponent} from './value-prop/value-prop.component';
import {IntroComponent} from './intro/intro.component';
import {FigmaComponent} from './figma/figma.component';

@NgModule({
  declarations: [ValuePropComponent, IntroComponent, FigmaComponent],
  exports: [ValuePropComponent, IntroComponent, FigmaComponent],
  imports: [CommonModule],
})
export class SectionsModule {}
