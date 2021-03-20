import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ValuePropComponent} from './value-prop/value-prop.component';
import {IntroComponent} from './intro/intro.component';

@NgModule({
  declarations: [ValuePropComponent, IntroComponent],
  exports: [ValuePropComponent, IntroComponent],
  imports: [CommonModule],
})
export class SectionsModule {}
