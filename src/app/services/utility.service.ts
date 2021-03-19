import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  calculateScroll(progress: number, distance: number = 3, delay: number = 0) {
    let scrollProgress = Math.floor(progress * 100) - delay;
    let endProgress = scrollProgress * distance;
    scrollProgress < 0 ? (scrollProgress = 0) : scrollProgress;
    endProgress < 0 ? (endProgress = 0) : endProgress;
    endProgress > 100 ? (endProgress = 100) : endProgress;
    return {
      start: scrollProgress,
      end: endProgress,
    };
  }
}