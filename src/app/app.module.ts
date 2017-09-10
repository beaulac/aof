import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NouisliderModule } from 'ng2-nouislider';
import { AppComponent } from './app.component';
import { HowlerService } from './audio/howler.service';
import { NodeService } from './graph/builder/node.service';
import { CytoscapeService } from './graph/cytoscape.service';
import { CyRendererComponent } from './graph/renderer/cy-renderer.component';
import { InfoComponent } from './info/info.component';
import { SamplesService } from './samples.service';

@NgModule({
              declarations: [
                  AppComponent,
                  CyRendererComponent,
                  InfoComponent
              ],
              imports: [
                  BrowserModule,
                  BrowserAnimationsModule,
                  HttpModule,
                  NouisliderModule
              ],
              providers: [SamplesService, HowlerService, NodeService, CytoscapeService],
              bootstrap: [AppComponent]
          })
export class AppModule {
}
