import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {HeroComponent} from './hero/hero.component';
import {AccordionComponent} from './accordion/accordion.component';

@NgModule({
  declarations: [HeaderComponent, HeroComponent, AccordionComponent],
  exports: [HeaderComponent, HeroComponent, AccordionComponent],
  imports: [CommonModule],
})
export class ComponentsModule {}
