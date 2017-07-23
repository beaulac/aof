import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HowlerService } from './howler.service';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AofSample } from './AofSample';
import { ReplaySubject } from 'rxjs/ReplaySubject';

const DRIVE_API_ROOT = 'https://content.googleapis.com/drive/v3';
const publicDownloadUrlFor = id => `https://drive.google.com/uc?export=download&id=${id}`;

/**
 * @param filename
 * @returns sample type
 * @example returns 'texture' for M8_Texture.mp3
 */
const filenameToType = filename => /_([^._\s]+)[\s.]+/.exec(filename)[1].toLowerCase();

interface DriveFileResponse {
    files: DriveFileEntry[];
    incompleteSearch: boolean;
    nextPageToken: string;
}

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

    private folderId = '0B721XY-cG39ueUNMVmZlWnpJeGc';
    private apiKey = 'AIzaSyDOpKlq-zL7tNOyF0UiZlwAt7OLWLQSSIk';


    private samplesURL = `${DRIVE_API_ROOT}/files?q=%27${this.folderId}%27+in+parents&key=${this.apiKey}`;

    private samples = new ReplaySubject<AofSample[]>(1);

    constructor(private http: Http, protected howlerService: HowlerService) {
        this.loadSamples().subscribe(samples => this.samples.next(samples));
    }

    trackSamples(): Observable<AofSample[]> {
        return this.samples;
    }

    loadSamples(): Observable<AofSample[]> {
        return this.http.get(this.samplesURL)
                   .map(
                       response => {
                           const fileResponse = response.json() as DriveFileResponse
                               , fileEntries = fileResponse.files;

                           const asSamples = fileEntries.map(file => this.fileResultToSample(file));
                           console.log(asSamples);
                           return asSamples;
                       }
                   );
    }

    fileResultToSample(fileResponse: DriveFileEntry): AofSample {
        const {id, name} = fileResponse;
        const howlSound = this.howlerService.buildHowlSound(publicDownloadUrlFor(id));
        return new AofSample(howlSound, name, filenameToType(name));
    }
}


