import { Component, OnInit } from '@angular/core';
import { LightService } from '../../services/light.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  /* State */
  private state: any

  /* Fader Colors */
  private faderColors: string[] = []
  public duration: number
  public interval: number

  public brightness: number

  constructor(private _lightService: LightService) {
    this.duration = 1
    this.interval = 0
  }

  ngOnInit() {
    this._lightService.currentFaderColors
      .subscribe((res: any) => {
        this.faderColors = res
      })

    this._lightService.getState()
      .subscribe((res: any) => {
        this._lightService.changeState(res)
      })

    this._lightService.currentState
      .subscribe((res: any) => {
        if (!res) return

        this.state = res
        this.brightness = this.state.brightness
      })
  }

  public increaseBrightness() {
    this.brightness += 25.5
    if (this.brightness > 255) {
      this.brightness = 255
    }

    this.setBrightness()
  }

  public decreaseBrightness() {
    this.brightness -= 25.5
    if (this.brightness < 0) {
      this.brightness = 0
    }

    this.setBrightness()
  }

  public setBrightness() {
    this._lightService.changeBrightness(this.brightness)
      .subscribe((res: any) => {
        console.log(res);
      })
  }

  public popColor() {
    this.faderColors.pop()
    this._lightService.changeFaderColors(this.faderColors)
  }

  public applyFader() {
    this._lightService.setFadeColors(this.faderColors, this.duration, this.interval)
      .subscribe((res: any) => {
        console.log(res);
      })
  }

}
