import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {gsap} from 'gsap';
import {UtilityService} from 'src/app/services/utility.service';

@Component({
  selector: 'c-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, AfterViewInit {
  signupForm: FormGroup;
  reserved = false;
  errors = {
    firstName: false,
    lastName: false,
    skillLevel: false,
  };
  @HostBinding('class') class = 'c-sign-up l-content--reveal';
  @HostBinding('style.--a-start') @Input() aStart: string = '0%';
  @HostBinding('style.--a-end') @Input() aEnd: string = '0%';
  @HostBinding('style.--b-start') @Input() bStart: string = '0%';
  @HostBinding('style.--b-end') @Input() bEnd: string = '0%';
  @ViewChild('brandTrigger') brandTrigger!: ElementRef;
  @ViewChildren('introTitle', {read: ElementRef}) introTitle!: QueryList<ElementRef>;
  constructor(
    private element: ElementRef,
    private render: Renderer2,
    private util: UtilityService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[a-z ,.'-]+$/i), this.validateSpaces]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-z ,.'-]+$/i), this.validateSpaces]],
      skillLevel: ['', [Validators.required]],
      comments: '',
    });
  }

  ngAfterViewInit(): void {}

  private validateSpaces(control: FormControl) {
    const valid = (control.value || '').trim().length !== 0;
    return valid ? null : {whitespace: true};
  }

  signUp() {
    for (const k in this.signupForm.controls) {
      this.errors[k] = this.checkError(k);
    }
    if (this.signupForm.status === 'VALID') {
      console.log('Valid store local storage and submit');
      this.reserved = true;
    }
  }

  checkError(field: string): boolean {
    return this.signupForm.get(field).errors !== null;
  }

  checkLocalStorage(): boolean {
    return localStorage.getItem('reserved') === null ? false : true;
  }
}
