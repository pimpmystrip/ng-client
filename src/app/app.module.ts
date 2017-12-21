import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatCardModule, MatSliderModule, MatInputModule, MatButtonModule, MatIconModule, MatSlideToggleModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';

import { LightService } from './services/light.service';
import { HttpClientModule } from '@angular/common/http/';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    ColorPickerComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatCardModule, MatSliderModule, MatInputModule, MatButtonModule, MatIconModule, MatSlideToggleModule
  ],
  providers: [LightService],
  bootstrap: [AppComponent]
})
export class AppModule { }
