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
import {Subject} from 'rxjs';
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
  signUpSuccess = false;
  signUpClosed = false;
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
  @ViewChild('checkMark') checkMark!: ElementRef;
  @ViewChild('checkMarkCircle1') checkMarkCircle1!: ElementRef;
  @ViewChild('checkMarkCircle2') checkMarkCircle2!: ElementRef;
  @ViewChild('bolt') bolt!: ElementRef;
  @ViewChild('boltSpark1') boltSpark1!: ElementRef;
  @ViewChild('boltSpark2') boltSpark2!: ElementRef;
  @ViewChild('scrollTarget') scrollTarget!: ElementRef;
  @ViewChild('signupSuccess') signupSuccess!: ElementRef;
  @ViewChild('successTrigger') successTrigger!: ElementRef;
  @ViewChild('theForm') theForm!: ElementRef;
  @ViewChildren('successCopy', {read: ElementRef}) successCopy!: QueryList<ElementRef>;
  @ViewChildren('formCopy', {read: ElementRef}) formCopy!: QueryList<ElementRef>;
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
      this.signUpSuccess = s.success;
      this.signUpClosed = s.closed;
    });
  }

  private initBoltGsap() {
    const bolt = gsap.timeline({
      defaults: {
        ease: 'back',
        repeat: -1,
        yoyo: true,
      },
    });

    bolt
      .fromTo(
        this.boltSpark1.nativeElement,
        {
          strokeDasharray: 80,
          strokeDashoffset: 360,
          strokeWidth: 0.75,
          stroke: '#fb3e54',
          opacity: 0,
        },
        {
          strokeDasharray: 110,
          strokeDashoffset: 0,
          duration: 0.75,
          stroke: '#e0fb3e',
          strokeWidth: 6,
          opacity: 1,
        }
      )
      .fromTo(
        this.boltSpark2.nativeElement,
        {
          strokeDasharray: 60,
          strokeDashoffset: 360,
          stroke: '#fb3e54',
          strokeWidth: 0.75,
          opacity: 0,
        },
        {
          strokeDasharray: 120,
          strokeDashoffset: 0,
          strokeWidth: 8,
          duration: 0.95,
          stroke: '#e0fb3e',
          opacity: 1,
        },
        0.145
      );
  }

  private initSuccessGsap() {
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
        this.checkMarkCircle1.nativeElement,
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
        this.checkMarkCircle2.nativeElement,
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
        this.checkMark.nativeElement,
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

  private initFormGsap() {
    const titles = this.formCopy.map((el) => el.nativeElement);
    const formAnime = gsap.timeline({
      defaults: {
        ease: 'power2',
      },
      scrollTrigger: {
        markers: false,
        trigger: this.element.nativeElement,
        start: 'top 75%',
        end: '70% 75%',
        scrub: 0.45,
      },
    });

    formAnime
      .from(
        titles,
        {
          y: 24,
          opacity: 0,
          stagger: 0.165,
        },
        0.75
      )
      .from(this.theForm.nativeElement, {
        y: 24,
        opacity: 0,
      });
  }

  ngAfterViewInit(): void {
    if (this.signUpSuccess) {
      this.initSuccessGsap();
    }
    if (this.signUpClosed) {
      this.initBoltGsap();
    }
    if (!this.signUpClosed || !this.signUpSuccess) {
      this.initFormGsap();
    }
  }

  reserveSeat(): void {
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
              this.signUpSuccess = state.success;
              localStorage.setItem('reserved', JSON.stringify(state.success));
              this.scrollTarget.nativeElement.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'start'});
              setTimeout(() => {
                this.initSuccessGsap();
              }, 0);
            }
            this.signupForm.reset();
          }
        })
      )
      .subscribe();
  }

  private checkError(field: string): boolean {
    return this.signupForm.get(field).errors !== null ? true : false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
