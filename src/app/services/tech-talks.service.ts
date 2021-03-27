import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {combineLatest, concat, forkJoin, Observable, of, zip} from 'rxjs';
import {catchError, concatMap, map, switchMap} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Alerts, Guest, GuestList, SignupInfo, Signups, UserAlerts} from './models/tach-talks.interface';

@Injectable({
  providedIn: 'root',
})
export class TechTalksService {
  private ep = environment.API_URL;
  constructor(private http: HttpClient) {}

  // check if user signed up already
  checkSelf() {}

  alerts(): Observable<Alerts> {
    return this.http
      .get<Alerts>(`${this.ep}/user_alerts`, {responseType: 'json'})
      .pipe(
        catchError((error) => {
          return of({data: []});
        })
      );
  }

  private signUps(): Observable<Signups> {
    return this.http
      .get<Signups>(`${this.ep}/sign_up`, {responseType: 'json'})
      .pipe(
        catchError((error) => {
          return of({data: []});
        })
      );
  }

  private guestList(): Observable<GuestList> {
    return this.http
      .get<GuestList>(`${this.ep}/guest_list`, {responseType: 'json'})
      .pipe(
        catchError((error) => {
          return of({data: []});
        })
      );
  }

  signupStatus(limit: number): Observable<boolean> {
    return this.signUps().pipe(
      map((signUps) => {
        return signUps.data.length === limit ? true : false;
      })
    );
  }

  private validateSignups(signupInfo: SignupInfo): Observable<any> {
    return this.guestList().pipe(
      map((data) => {
        const validateData = {
          status: {
            onGuestList: false,
            reserved: false,
            success: false,
            error: false,
          },
        };
        if (
          data.data.some((guest) => guest.first_name.toLowerCase() === signupInfo.first_name.toLowerCase()) &&
          data.data.some((guest) => guest.last_name.toLowerCase() === signupInfo.last_name.toLowerCase())
        ) {
          validateData.status.onGuestList = true;
        }

        return validateData;
      })
    );
  }

  signUp(signupInfo: SignupInfo): Observable<any> {
    return this.validateSignups(signupInfo).pipe(
      switchMap((validateData) => {
        if (validateData.status.onGuestList) {
          return this.http
            .post<Signups>(`${this.ep}/sign_up`, signupInfo, {responseType: 'json'})
            .pipe(
              map((data) => {
                // sign up success
                validateData.status.success = true;
                return validateData;
              }),
              catchError((error) => {
                // Error
                if (error.error.error.code === 4) {
                  validateData.status.error = true;
                  return of(validateData);
                }
                // If user already signed up
                if (error.error.error.code === 204) {
                  validateData.status.reserved = true;
                  return of(validateData);
                }
                // API error
                return of(validateData);
              })
            );
        }
        return of(validateData);
      })
    );
  }
}
