import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Injector,
  Input,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';

import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {gsap} from 'gsap';
import {of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {TechTalksService} from 'src/app/services/tech-talks.service';
import {UtilityService} from 'src/app/services/utility.service';

@Component({
  selector: 'c-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [style({opacity: 0}), animate('275ms', style({opacity: 1}))]),
      transition(':leave', [style({opacity: 1}), animate('275ms', style({opacity: 0}))]),
    ]),
  ],
})
export class SignUpComponent implements OnInit, AfterViewInit {
  signupForm: FormGroup;
  reserved = false;
  signupClosed = true;
  signedUp = false;
  checkPlay: GSAPTimeline;
  alerts = {
    guestList: {
      error: false,
      errorMsg: null,
    },
    signedUp: {
      error: false,
      errorMsg: null,
    },
    success: {
      error: false,
      errorMsg: null,
    },
  };
  errors = {
    first_name: {
      error: false,
      errorMsg: null,
    },
    last_name: {
      error: false,
      errorMsg: null,
    },
    skill_level: {
      error: false,
      errorMsg: null,
    },
  };
  @HostBinding('class') class = 'c-sign-up l-content--reveal';
  @HostBinding('style.--a-start') @Input() aStart: string = '0%';
  @HostBinding('style.--a-end') @Input() aEnd: string = '0%';
  @HostBinding('style.--b-start') @Input() bStart: string = '0%';
  @HostBinding('style.--b-end') @Input() bEnd: string = '0%';
  @ViewChild('check') check!: ElementRef;
  @ViewChild('checkLoader') checkLoader!: ElementRef;
  @ViewChild('target') target!: ElementRef;
  @ViewChild('signupSuccess') signupSuccess!: ElementRef;
  @ViewChildren('introTitle', {read: ElementRef}) introTitle!: QueryList<ElementRef>;
  constructor(
    private element: ElementRef,
    private render: Renderer2,
    private util: UtilityService,
    private fb: FormBuilder,
    private techTalks: TechTalksService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.pattern(/^[a-z ,.'-]+$/i), this.validateSpaces]],
      last_name: ['', [Validators.required, Validators.pattern(/^[a-z ,.'-]+$/i), this.validateSpaces]],
      skill_level: ['', [Validators.required]],
      comments: '',
      reserved: 1,
    });
    this.techTalks.signupStatus(12).subscribe((bool) => {
      this.signupClosed = bool;
    });
  }

  ngAfterViewInit(): void {
    this.checkPlay = gsap.timeline({
      defaults: {
        ease: 'power2',
      },
    });
    //this.checkPlay.pause();
    this.checkPlay
      .fromTo(
        this.checkLoader.nativeElement,
        {
          strokeDasharray: 360,
          strokeDashoffset: 0,
          rotate: '0deg',
          stroke: '#fb3e54',
          opacity: 0,
        },
        {
          strokeDashoffset: -720,
          rotate: '360deg',
          duration: 2.45,
          transformOrigin: '50%',
          stroke: '#e0fb3e',
          opacity: 1,
        }
      )
      .fromTo(
        this.check.nativeElement,
        {
          strokeDasharray: 110,
          strokeDashoffset: -110,
          stroke: '#fb3e54',
          opacity: 0,
        },
        {
          strokeDashoffset: 0,
          duration: 0.45,
          stroke: '#e0fb3e',
          opacity: 1,
        },
        0.65
      );
  }

  replay() {
    this.checkPlay.restart();
  }

  private validateSpaces(control: FormControl) {
    const valid = (control.value || '').trim().length !== 0;
    return valid ? null : {whitespace: true};
  }

  signUp(): void {
    console.clear();
    this.alerts.signedUp.error = false;
    this.alerts.guestList.error = false;
    this.alerts.success.error = false;
    this.techTalks
      .alerts()
      .pipe(
        switchMap((alerts) => {
          const alertMsgs = alerts.data[0].user_alerts;
          for (const k in this.errors) {
            this.errors[k].error = this.checkError(k);
            if (this.signupForm.get(k).errors !== null) {
              if (k === 'first_name' && this.checkError(k)) {
                this.errors[k].errorMsg = alertMsgs.first_name_error;
              }
              if (k === 'first_name' && this.signupForm.get(k).errors.pattern) {
                this.errors[k].errorMsg = alertMsgs.invalid_name;
              }
              if (k === 'last_name' && this.checkError(k)) {
                this.errors[k].errorMsg = alertMsgs.last_name_error;
              }
              if (k === 'last_name' && this.signupForm.get(k).errors.pattern) {
                this.errors[k].errorMsg = alertMsgs.invalid_name;
              }
              if (k === 'skill_level' && this.checkError(k)) {
                this.errors[k].errorMsg = alertMsgs.skill_level_error;
              }
            }
          }
          if (this.signupForm.status === 'VALID') {
            return this.techTalks.signUp(this.signupForm.value).pipe(
              map((data) => {
                console.log(data);
                if (!data.status.onGuestList) {
                  console.log(alertMsgs.guest_list);
                  this.alerts.signedUp.errorMsg = alertMsgs.guest_list;
                  this.alerts.guestList.error = true;
                  this.signupForm.reset();
                }
                if (data.status.reserved) {
                  console.log(alertMsgs.reserved_error);
                  this.alerts.signedUp.errorMsg = alertMsgs.reserved_error;
                  this.alerts.signedUp.error = true;
                  this.signupForm.reset();
                }
                if (data.status.success) {
                  console.log(alertMsgs.signup_success);
                  this.alerts.success.errorMsg = alertMsgs.signup_success;
                  this.alerts.success.error = true;
                  this.signupForm.reset();
                }
              })
            );
          }
          return of(null);
        })
      )
      .subscribe((data) => {
        //this.target.nativeElement.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'start'});
      });
  }

  checkError(field: string): boolean {
    return this.signupForm.get(field).errors !== null ? true : false;
  }

  checkLocalStorage(): boolean {
    return localStorage.getItem('reserved') === null ? false : true;
  }
}
