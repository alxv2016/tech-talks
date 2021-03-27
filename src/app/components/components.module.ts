import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {HeroComponent} from './hero/hero.component';
import {AccordionComponent} from './accordion/accordion.component';
import {FooterComponent} from './footer/footer.component';
import {DialogComponent} from './dialog/dialog.component';

@NgModule({
  declarations: [HeaderComponent, HeroComponent, AccordionComponent, FooterComponent, DialogComponent],
  exports: [HeaderComponent, HeroComponent, AccordionComponent, FooterComponent, DialogComponent],
  imports: [CommonModule],
})
export class ComponentsModule {}
