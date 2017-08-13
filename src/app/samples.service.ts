import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { environment } from '../environments/environment';
import { AofSample } from './audio/AofSample';
import { HowlerService } from './audio/howler.service';

const publicDownloadUrlFor = id => `${environment.corsProxyUrl}/https://drive.google.com/uc?export=download&id=${id}`;

/**
 * @param filename
 * @returns sample type
 * @example returns 'texture' for M8_Texture.mp3
 */
const filenameToType = filename => (/_([^._\s]+)[\s.]+/.exec(filename) || [, 'unknown'])[1].toLowerCase();

/**
 * @example
 * {
 *  "kind": "drive#file",
 *  "id": "0B721XY-cG39uY0xRcWR5V1ZvMVU",
 *  "name": "M8_Texture.mp3",
 *  "mimeType": "audio/mp3"
 * }
 */
interface DriveFileEntry {
    kind: 'drive#file'
    id: string;
    name: string;
    mimetype: string;
}

@Injectable()
export class SamplesService {
    private samplesURL = `${environment.samplesServerUrl}/samples`;

    private samples = new ReplaySubject<AofSample[]>(1);

    constructor(private http: Http, protected howlerService: HowlerService) {
        this.loadSamples().subscribe(samples => this.samples.next(samples));
    }

    trackSamples(): Observable<AofSample[]> {
        return this.samples;
    }

    loadSamples(): Observable<AofSample[]> {
        return this.http.get(this.samplesURL)
                   .map(response => {
                       const fileEntries = response.json() as DriveFileEntry[];
                       return fileEntries.map(file => this.fileResultToSample(file));
                   });
    }

    fileResultToSample(fileResponse: DriveFileEntry): AofSample {
        const {id, name} = fileResponse;
        const howlSound = this.howlerService.buildHowlSound(publicDownloadUrlFor(id));

        return new AofSample(howlSound, name, filenameToType(name));
    }
}


