import { trigger, state, style, transition, animate } from '@angular/animations';

export const fadeInOutAnimation: any = trigger('elementTransition', [
  state('void', style({opacity: 0})),
  state('*', style({opacity: 1})),
  transition('void <=> *', [
    animate('.8s ease-in-out')
  ])
]);

export const quickFadeInOutAnimation: any = trigger('elementTransition', [
  state('void', style({opacity: 0})),
  state('*', style({opacity: 1})),
  transition('void <=> *', [
    animate('.3s ease-in-out')
  ])
]);
