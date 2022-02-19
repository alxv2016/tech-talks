import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {PrismicQuery, TechTalksCollection} from './models/content.interface';
import {Prismic} from './models/prismic-api.interface';

const initialState: TechTalksCollection = {
  page_title: null,
  hero_title: null,
  hero_content: null,
  value_props: null,
  intro_callout: null,
  intro_title: null,
  intro_content: null,
  topics: null,
  experience_callout: null,
  experience_title: null,
  experience_content: null,
  session_callout: null,
  session_title: null,
  session_content: null,
  host_title: null,
  hosts: null,
  faq_title: null,
  faqs: null,
  slogan: null,
};

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private ep = environment.API_URL;
  private token = environment.TOKEN;
  private _initialState = new BehaviorSubject<TechTalksCollection>(initialState);
  siteContent$ = this._initialState.asObservable();
  constructor(private http: HttpClient) {}
  // API
  getSiteContent(): Observable<TechTalksCollection> {
    return this.http.get<Prismic>(`${this.ep}`, {responseType: 'json'}).pipe(
      switchMap((ref) => {
        const refToken = ref.refs[0].ref;
        const query = '[[at(document.type, "tech_talks")]]';
        const params = new HttpParams().set('ref', refToken).set('access_token', this.token).set('q', query);
        return this.http.get<PrismicQuery>(`${this.ep}/documents/search`, {params, responseType: 'json'}).pipe(
          map((resp) => {
            const siteData = resp.results[0].data;
            console.log(siteData);
            const siteContent = Object.assign(initialState, siteData);
            this._initialState.next(siteContent);
            return initialState;
          })
        );
      }),
      catchError((error) => {
        this._initialState.next(initialState);
        return of(initialState);
      })
    );
  }
}
