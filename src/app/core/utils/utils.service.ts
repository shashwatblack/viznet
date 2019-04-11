import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class UtilsService {
  constructor() {}

  logger(message) {
    console.log(`${Date.now()}: ${message}`);
  }

  delay(callback) {
    return () => setTimeout(callback, 0);
  }

  debounce(func, wait, immediate = false) {
    let timeout;
    return function() {
      let context = this,
        args = arguments;
      let later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
}
