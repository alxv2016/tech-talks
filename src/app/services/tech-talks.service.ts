import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {forkJoin, Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Alerts, GuestList, ReservedSeats, SignupInfo, UserAlerts} from './models/tach-talks.interface';

@Injectable({
  providedIn: 'root',
})
export class TechTalksService {
  private ep = environment.API_URL;
  constructor(private http: HttpClient) {}

  // check if user signed up already
  checkSelf() {}

  checkReservations(limit: number): Observable<any> {
    const signUpClosed = {
      guests: [],
      errorMsg: null,
      alerts: null,
      closed: true,
      error: false,
    };
    return this.http
      .get<Alerts>(`${this.ep}/user_alerts`, {responseType: 'json'})
      .pipe(
        switchMap((userAlerts) => {
          return this.http
            .get<ReservedSeats>(`${this.ep}/sign_up`, {responseType: 'json'})
            .pipe(
              map((seats) => {
                signUpClosed.alerts = userAlerts.data[0].user_alerts;
                signUpClosed.guests = seats.data;
                if (seats.data.length !== 0 && seats.data.length <= limit) {
                  signUpClosed.closed = false;
                  return signUpClosed;
                }
                signUpClosed.errorMsg = userAlerts.data[0].user_alerts.no_seats_left;
                return signUpClosed;
              }),
              catchError((error) => {
                signUpClosed.errorMsg = userAlerts.data[0].user_alerts.generic_error;
                signUpClosed.error = true;
                return of(signUpClosed);
              })
            );
        }),
        catchError((error) => {
          // Hard coded backup
          signUpClosed.errorMsg = `Uh oh! Something went wrong, please try again later.`;
          return of(signUpClosed);
        })
      );
  }

  private checkGuestList(signupInfo: SignupInfo): Observable<any> {
    const canadaStudio = {
      guestList: [],
      onList: false,
      error: true,
    };
    return this.http
      .get<GuestList>(`${this.ep}/guest_list`, {responseType: 'json'})
      .pipe(
        map((guestList) => {
          if (
            guestList.data.length !== 0 &&
            guestList.data.some((guest) => guest.first_name === signupInfo.first_name) &&
            guestList.data.some((guest) => guest.last_name === signupInfo.last_name)
          ) {
            canadaStudio.guestList = guestList.data;
            canadaStudio.onList = true;
            canadaStudio.error = false;
            return canadaStudio;
          }
          canadaStudio.guestList = guestList.data;
          canadaStudio.error = false;
          return canadaStudio;
        }),
        catchError((error) => {
          return of(canadaStudio);
        })
      );
  }

  signUp(signupInfo: SignupInfo): Observable<any> {
    const $guestList = this.checkGuestList(signupInfo);
    return $guestList.pipe(
      switchMap((guestList) => {
        if (!guestList.error && guestList.onList) {
          return this.http
            .post<ReservedSeats>(`${this.ep}/sign_up`, signupInfo, {responseType: 'json'})
            .pipe(
              map((data) => {
                // sign up success
                return data;
              }),
              catchError((error) => {
                // If user already signed up
                guestList.error = true;
                if (error.error.error.code === 204) {
                  return of(guestList);
                }
                // API error
                return of(guestList);
              })
            );
        }
        return of(guestList);
      })
    );
  }
}
