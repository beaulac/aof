import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NouisliderModule } from 'ng2-nouislider';
import { AppComponent } from './app.component';
import { HowlerService } from './audio/howler.service';
import { NodeService } from './graph/builder/node.service';
import { CyRendererComponent } from './graph/renderer/cy-renderer.component';
import { InfoComponent } from './info/info.component';
import { SamplesService } from './samples.service';
import { InfoAnnotationComponent } from './info/info-annotation/info-annotation.component';

@NgModule({
              declarations: [
                  AppComponent,
                  CyRendererComponent,
                  InfoComponent,
                  InfoAnnotationComponent,
              ],
              imports: [
                  BrowserModule,
                  BrowserAnimationsModule,
                  HttpModule,
                  NouisliderModule,
              ],
              providers: [SamplesService, HowlerService, NodeService],
              bootstrap: [AppComponent],
          })
export class AppModule {
}
