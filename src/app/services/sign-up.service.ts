import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Alerts, GuestList, SignUpList, SignUpState, UserAlerts, UserInfo} from './models/tach-talks.interface';

const initialState: SignUpState = {
  guestList: [],
  alerts: [],
  closed: false,
  allowed: false,
  success: false,
  reserved: false,
};

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private ep = environment.API_URL;
  private _initialState = new BehaviorSubject<SignUpState>(initialState);
  signUpState$ = this._initialState.asObservable();
  constructor(private http: HttpClient) {
    if (localStorage.getItem('reserved') !== null) {
      initialState.reserved = JSON.parse(localStorage.getItem('reserved'));
      this._initialState.next(initialState);
    }
  }
  // API
  private getAlerts(): Observable<SignUpState> {
    return this.http
      .get<UserAlerts>(`${this.ep}/user_alerts`, {responseType: 'json'})
      .pipe(
        map((alerts) => {
          initialState.alerts = alerts.data;
          this._initialState.next(initialState);
          return initialState;
        }),
        catchError((error) => {
          this._initialState.next(initialState);
          return of(initialState);
        })
      );
  }

  private checkGuestList(signUpUser: string): Observable<SignUpState> {
    return this.http
      .get<GuestList>(`${this.ep}/guest_list`, {responseType: 'json'})
      .pipe(
        map((guestList) => {
          initialState.guestList = guestList.data;
          if (
            guestList.data.some((user) => (user.first_name + user.last_name).toLowerCase() === signUpUser.toLowerCase())
          ) {
            initialState.allowed = true;
          } else {
            initialState.allowed = false;
          }
          this._initialState.next(initialState);
          return initialState;
        }),
        catchError((error) => {
          this._initialState.next(initialState);
          return of(initialState);
        })
      );
  }

  private reserveSeat(userInfo: UserInfo): Observable<SignUpState> {
    return this.http
      .post<SignUpList>(`${this.ep}/sign_up`, userInfo, {responseType: 'json'})
      .pipe(
        map((_) => {
          initialState.success = true;
          initialState.reserved = false;
          this._initialState.next(initialState);
          return initialState;
        }),
        catchError((error) => {
          if (error.error.error.code === 4) {
            // Generic error
          }
          // If user already signed up
          if (error.error.error.code === 204) {
            initialState.reserved = true;
          }
          initialState.success = false;
          this._initialState.next(initialState);
          return of(initialState);
        })
      );
  }

  getSignUpStatus(): Observable<SignUpState> {
    return this.http
      .get<SignUpList>(`${this.ep}/sign_up`, {responseType: 'json'})
      .pipe(
        map((users) => {
          if (users.data.length === 10) {
            initialState.closed = true;
          } else {
            initialState.closed = false;
          }
          this._initialState.next(initialState);
          return initialState;
        }),
        catchError((error) => {
          this._initialState.next(initialState);
          return of(initialState);
        })
      );
  }

  signUp(userInfo: UserInfo): Observable<SignUpState> {
    const fullname = userInfo.first_name + userInfo.last_name;
    return forkJoin([this.getAlerts(), this.checkGuestList(fullname)]).pipe(
      switchMap((data) => {
        if (data[1].allowed) {
          return this.reserveSeat(userInfo).pipe(
            map((data) => {
              return data;
            })
          );
        }
        this._initialState.next(initialState);
        return of(initialState);
      })
    );
  }
}
