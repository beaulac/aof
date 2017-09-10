import { animate, style, transition, trigger } from '@angular/animations';

const duration = '250ms';

const whenHidden = {opacity: 0}
    , whenShown = {opacity: 1};

export const fadeAnimation = trigger(
    'enterAnimation', [
        transition(':enter', [
            style(whenHidden),
            animate(duration, style(whenShown))
        ]),
        transition(':leave', [
            style(whenShown),
            animate(duration, style(whenHidden))
        ])
    ]
);
