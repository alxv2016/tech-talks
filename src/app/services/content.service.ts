import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Content, SiteContent} from './models/content.interface';

const initialState: Content = {
  hero: {
    title: null,
    body: null,
  },
  value_props: [],
  intro: {
    overline: null,
    title: null,
    body: null,
  },
  features: [],
  session: {
    overline: null,
    title: null,
    body: null,
    auto_layout_overline: null,
    auto_layout_title: null,
    auto_layout_intro: null,
    variant_overline: null,
    variant_title: null,
    variant_intro: null,
    prototype_overline: null,
    prototype_title: null,
    prototype_intro: null,
  },
  sign_up: {
    overline: null,
    title: null,
    body: null,
  },
  sign_up_success: {
    overline: null,
    title: null,
    body: null,
  },
  sign_up_closed: {
    overline: null,
    title: null,
    body: null,
  },
  form: {
    first_name: null,
    last_name: null,
    skill_level: null,
    comments: null,
    helper: null,
    action: null,
  },
  form_skill: [],
  hosts: {
    title: null,
  },
  host: [],
  faqs: {
    title: null,
  },
  faq_panels: [],
};

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private ep = environment.API_URL;
  private _initialState = new BehaviorSubject<Content>(initialState);
  siteContent$ = this._initialState.asObservable();
  constructor(private http: HttpClient) {}
  // API
  getSiteContent(): Observable<Content> {
    return this.http
      .get<SiteContent>(`${this.ep}/content`, {responseType: 'json'})
      .pipe(
        map((data) => {
          const siteContent = Object.assign(initialState, data.data[0]);
          this._initialState.next(siteContent);
          return initialState;
        }),
        catchError((error) => {
          this._initialState.next(initialState);
          return of(initialState);
        })
      );
  }
}
