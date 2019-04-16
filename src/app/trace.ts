import { environment } from '../environments/environment';

export function _trace(...args: any[]) {
    if (!environment.production) {
        console.log.apply(console, args);
    }
}
