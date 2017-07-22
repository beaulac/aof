import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CyRendererComponent } from './cy-renderer/cy-renderer.component';

@NgModule({
  declarations: [
    AppComponent,
    CyRendererComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
