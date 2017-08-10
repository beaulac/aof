import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NouisliderModule } from 'ng2-nouislider';
import { AppComponent } from './app.component';
import { CyRendererComponent } from './graph/renderer/cy-renderer.component';
import { CytoscapeService } from './graph/cytoscape.service';
import { HowlerService } from './audio/howler.service';
import { NodeService } from './graph/builder/node.service';
import { SamplesService } from './samples.service';
import { InfoComponent } from './info/info.component';

@NgModule({
              declarations: [
                  AppComponent,
                  CyRendererComponent,
                  InfoComponent
              ],
              imports: [
                  BrowserModule,
                  HttpModule,
                  NouisliderModule
              ],
              providers: [SamplesService, HowlerService, NodeService, CytoscapeService],
              bootstrap: [AppComponent]
          })
export class AppModule {
}
