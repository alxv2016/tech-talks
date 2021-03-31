import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {HeroComponent} from './hero/hero.component';
import {AccordionComponent} from './accordion/accordion.component';
import {FooterComponent} from './footer/footer.component';
import {WarningComponent} from './warning/warning.component';

@NgModule({
  declarations: [HeaderComponent, HeroComponent, AccordionComponent, FooterComponent, WarningComponent],
  exports: [HeaderComponent, HeroComponent, AccordionComponent, FooterComponent, WarningComponent],
  imports: [CommonModule],
})
export class ComponentsModule {}
