import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {forkJoin, Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {GuestList, ReservedSeats, SignupInfo} from './models/tach-talks.interface';

@Injectable({
  providedIn: 'root',
})
export class TechTalksService {
  private ep = environment.API_URL;

  constructor(private http: HttpClient) {}

  checkGuestList(userInfo: SignupInfo): Observable<boolean> {
    const $guestList = this.http.get<GuestList>(`${this.ep}/guest_list`, {responseType: 'json'});
    const $reservations = this.http.get<ReservedSeats>(`${this.ep}/sign_up`, {responseType: 'json'});
    return $guestList.pipe(
      switchMap((guests) => {
        if (
          guests.data.length <= 10 &&
          guests.data.some((guest) => guest.first_name === userInfo.first_name) &&
          guests.data.some((guest) => guest.last_name === userInfo.last_name)
        ) {
          return $reservations.pipe(
            map((reservations) => {
              if (
                reservations.data.length !== 0 &&
                reservations.data.some((guest) => guest.first_name === userInfo.first_name) &&
                reservations.data.some((guest) => guest.last_name === userInfo.last_name)
              ) {
                return false;
              }
              return true;
            })
          );
        }
        return of(false);
      })
    );
  }

  signUp(userInfo: SignupInfo): Observable<any> {
    return this.checkGuestList(userInfo).pipe(
      switchMap((availableSeat) => {
        if (availableSeat) {
          return this.http
            .post<SignupInfo>(`${this.ep}/sign_up`, userInfo, {responseType: 'json'})
            .pipe(
              switchMap((_) => {
                return this.http.get<ReservedSeats>(`${this.ep}/sign_up`, {responseType: 'json'});
              })
            );
        }
        //
        return this.http.get<ReservedSeats>(`${this.ep}/sign_up`, {responseType: 'json'});
      })
    );
  }
}
