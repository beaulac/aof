import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CyRendererComponent } from './cy-renderer/cy-renderer.component';
import { CytoscapeService } from './cytoscape.service';
import { HowlerService } from './howler.service';
import { NodeService } from './node.service';
import { SamplesService } from './samples.service';

@NgModule({
              declarations: [
                  AppComponent,
                  CyRendererComponent
              ],
              imports: [
                  BrowserModule,
                  HttpModule
              ],
              providers: [SamplesService, HowlerService, NodeService, CytoscapeService],
              bootstrap: [AppComponent]
          })
export class AppModule {
}
