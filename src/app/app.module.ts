import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ComponentsModule} from './components/components.module';
import {SectionsModule} from './sections/sections.module';
import {HotToastModule} from '@ngneat/hot-toast';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ComponentsModule,
    SectionsModule,
    HotToastModule.forRoot({
      dismissible: true,
      autoClose: false,
      position: 'bottom-center',
      className: 'c-toasty',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
