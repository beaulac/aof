import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { environment } from '../environments/environment';
import { AofSample } from './audio/AofSample';
import { HowlerService } from './audio/howler.service';

const publicDownloadUrlFor = name => `${environment.samplesServerUrl}/${name}`;

/**
 * @param filename
 * @returns sample type
 * @example returns 'texture' for M8_Texture.mp3
 */
const filenameToType = filename => (/_([^._\s]+)[\s.]+/.exec(filename) || [, 'unknown'])[1].toLowerCase();

/**
 * @example
 * {
 *  "name": "M8_Texture.mp3"
 * }
 */
interface FileEntry {
    name: string;
}

@Injectable()
export class SamplesService {

    private samples = new ReplaySubject<AofSample[]>(1);

    constructor(private http: Http, protected howlerService: HowlerService) {
        this.loadSamples().subscribe(samples => this.samples.next(samples));
    }

    trackSamples(): Observable<AofSample[]> {
        return this.samples;
    }

    loadSamples(): Observable<AofSample[]> {
        const validExtensions = /.+\.(mp3|ogg)$/;

        return this.http.get(environment.samplesIndexUrl)
                   .map(response => {
                       const fileEntries = response.text().split(/\r?\n/);
                       return fileEntries.filter(filename => validExtensions.test(filename))
                                         .map(file => this.fileResultToSample({ name: file }));
                   });
    }

    fileResultToSample(fileResponse: FileEntry): AofSample {
        const { name } = fileResponse;
        const howlSound = this.howlerService.buildHowlSound(publicDownloadUrlFor(name));

        return new AofSample(howlSound, name, filenameToType(name));
    }
}
