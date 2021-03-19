import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {HeroComponent} from './hero/hero.component';

@NgModule({
  declarations: [HeaderComponent, HeroComponent],
  exports: [HeaderComponent, HeroComponent],
  imports: [CommonModule],
})
export class ComponentsModule {}
