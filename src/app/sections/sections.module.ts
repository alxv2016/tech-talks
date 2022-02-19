import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ValuePropComponent} from './value-prop/value-prop.component';
import {IntroComponent} from './intro/intro.component';
import {FigmaComponent} from './figma/figma.component';
import {HostsComponent} from './hosts/hosts.component';
import {FaqComponent} from './faq/faq.component';
import {ComponentsModule} from '../components/components.module';
import {SignUpComponent} from './sign-up/sign-up.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ExperienceComponent} from './experience/experience.component';

@NgModule({
  declarations: [
    ValuePropComponent,
    IntroComponent,
    FigmaComponent,
    HostsComponent,
    FaqComponent,
    SignUpComponent,
    ExperienceComponent,
  ],
  exports: [
    ValuePropComponent,
    IntroComponent,
    FigmaComponent,
    HostsComponent,
    FaqComponent,
    SignUpComponent,
    ExperienceComponent,
  ],
  imports: [CommonModule, ComponentsModule, ReactiveFormsModule, FormsModule],
})
export class SectionsModule {}
