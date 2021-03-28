import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {trigger, style, animate, transition} from '@angular/animations';

import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {gsap} from 'gsap';
import {forkJoin, of, Subject} from 'rxjs';
import {map, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {UtilityService} from 'src/app/services/utility.service';
import {SignUpService} from 'src/app/services/sign-up.service';

@Component({
  selector: 'c-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [style({opacity: 0}), animate('175ms', style({opacity: 1}))]),
      transition(':leave', [style({opacity: 1}), animate('175ms', style({opacity: 0}))]),
    ]),
  ],
})
export class SignUpComponent implements OnInit, AfterViewInit, OnDestroy {
  private unsubscribe$ = new Subject();
  signupForm: FormGroup;
  signedUpSuccess = false;
  signupClosed = false;
  alerts = {
    guestList: {
      error: false,
      errorMsg: null,
    },
    signedUp: {
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
  @HostBinding('class') class = 'c-sign-up';
  @HostBinding('style.--a-start') @Input() aStart: string = '0%';
  @HostBinding('style.--a-end') @Input() aEnd: string = '0%';
  @HostBinding('style.--b-start') @Input() bStart: string = '0%';
  @HostBinding('style.--b-end') @Input() bEnd: string = '0%';
  @ViewChild('check') check!: ElementRef;
  @ViewChild('checkLoader') checkLoader!: ElementRef;
  @ViewChild('checkPath') checkPath!: ElementRef;
  @ViewChild('target') target!: ElementRef;
  @ViewChild('signupSuccess') signupSuccess!: ElementRef;
  @ViewChild('successTrigger') successTrigger!: ElementRef;
  @ViewChildren('successCopy', {read: ElementRef}) successCopy!: QueryList<ElementRef>;
  @ViewChildren('introTitle', {read: ElementRef}) introTitle!: QueryList<ElementRef>;
  constructor(
    private element: ElementRef,
    private render: Renderer2,
    private util: UtilityService,
    private fb: FormBuilder,
    private signUpService: SignUpService
  ) {}

  private validateSpaces(control: FormControl) {
    const valid = (control.value || '').trim().length !== 0;
    return valid ? null : {whitespace: true};
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.pattern(/^[a-z ,.'-]+$/i), this.validateSpaces]],
      last_name: ['', [Validators.required, Validators.pattern(/^[a-z ,.'-]+$/i), this.validateSpaces]],
      skill_level: ['', [Validators.required]],
      comments: '',
      reserved: 1,
    });

    this.signUpService.signUpState$.subscribe((s) => {
      this.signedUpSuccess = s.success;
    });
  }

  private initGsap() {
    const titles = this.successCopy.map((el) => el.nativeElement);
    const checkmark = gsap.timeline({
      defaults: {
        ease: 'power2',
      },
      scrollTrigger: {
        markers: false,
        trigger: this.successTrigger.nativeElement,
        start: 'top 75%',
        end: 'bottom 75%',
        toggleActions: 'play none none reset',
        // scrub: 0.45,
      },
    });

    checkmark
      .fromTo(
        this.checkLoader.nativeElement,
        {
          strokeDasharray: 360,
          strokeDashoffset: 720,
          rotate: '0deg',
          stroke: '#fb3e54',
          opacity: 0,
        },
        {
          strokeDashoffset: 0,
          rotate: '360deg',
          duration: 2.45,
          transformOrigin: '50%',
          stroke: '#e0fb3e',
          opacity: 1,
        }
      )
      .fromTo(
        this.checkPath.nativeElement,
        {
          strokeDasharray: 360,
          strokeDashoffset: 360,
          stroke: '#fb3e54',
          opacity: 0,
        },
        {
          strokeDashoffset: 0,
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
          strokeDashoffset: 110,
          stroke: '#fb3e54',
          opacity: 0,
        },
        {
          strokeDashoffset: 0,
          duration: 2.45,
          stroke: '#e0fb3e',
          opacity: 1,
        },
        0.75
      )
      .from(
        titles,
        {
          y: 24,
          opacity: 0,
          stagger: 0.165,
        },
        0.75
      );
  }

  ngAfterViewInit(): void {
    if (this.signedUpSuccess) {
      this.initGsap();
    }
  }

  signUp(): void {
    this.alerts.signedUp.error = false;
    this.alerts.guestList.error = false;
    this.signUpService
      .signUp(this.signupForm.value)
      .pipe(
        tap((state) => {
          const alertMsgs = state.alerts[0].user_alerts;
          for (const k in this.errors) {
            this.errors[k].error = this.checkError(k);
            console.log(this.signupForm.get(k).errors);
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
            if (!state.allowed) {
              console.log(alertMsgs.guest_list);
              this.alerts.guestList.errorMsg = alertMsgs.guest_list;
              this.alerts.guestList.error = true;
            }
            if (state.reserved) {
              console.log(alertMsgs.reserved_error);
              this.alerts.signedUp.errorMsg = alertMsgs.reserved_error;
              this.alerts.signedUp.error = true;
            }
            if (state.success) {
              this.signedUpSuccess = state.success;
              localStorage.setItem('reserved', JSON.stringify(state.success));
              this.target.nativeElement.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'start'});
              setTimeout(() => {
                this.initGsap();
              }, 0);
            }
            this.signupForm.reset();
          }
        })
      )
      .subscribe((d) => console.log(d));
  }

  checkError(field: string): boolean {
    return this.signupForm.get(field).errors !== null ? true : false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
