import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {forkJoin, Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {GuestList, ReservedSeats, SignupInfo} from './models/tach-talks.interface';

@Injectable({
  providedIn: 'root',
})
export class TechTalksService {
  private ep = environment.API_URL;
  constructor(private http: HttpClient) {}

  checkReservations(limit: number): Observable<any> {
    const signUpClosed = {
      guests: [],
      closed: true,
      error: false,
    };
    return this.http
      .get<ReservedSeats>(`${this.ep}/sign_up`, {responseType: 'json'})
      .pipe(
        map((seats) => {
          signUpClosed.guests = seats.data;
          if (seats.data.length !== 0 && seats.data.length <= limit) {
            signUpClosed.closed = false;
            return signUpClosed;
          }
          return signUpClosed;
        }),
        catchError((error) => {
          signUpClosed.error = true;
          return of(signUpClosed);
        })
      );
  }

  checkGuestList(signupInfo: SignupInfo): Observable<any> {
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
                return data;
              }),
              catchError((error) => {
                // If user already signed up
                if (error.error.error.code === 204) {
                  return of('Already signed up');
                }
                // API error
                return of(error.error.error.code);
              })
            );
        }
        return of(guestList);
      })
    );
  }
}
