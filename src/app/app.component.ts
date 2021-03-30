import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {ContentService} from './services/content.service';
import {Content} from './services/models/content.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  siteContent: Content;
  private unsubscribe$ = new Subject();

  constructor(private contentService: ContentService) {}

  ngOnInit(): void {
    this.contentService
      .getSiteContent()
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((_) => {
          return this.contentService.siteContent$;
        })
      )
      .subscribe((data) => {
        this.siteContent = data;
        console.log(data);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
