import { Component, OnInit } from '@angular/core';
import { Color } from '../../models/color';
import { LightService } from '../../services/light.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent implements OnInit {

  /* State */
  public state: any

  /* Fader Colors */
  private faderColors: any[] = []

  public inputColor: Color
  public hexcode: string
  public enableFade: boolean
  public fadeDuration: number
  public disableButton: boolean = false

  constructor(private _lightService: LightService) {
    this.inputColor = new Color()
  }

  ngOnInit() {
    /* Get from localstorage */
    this.enableFade = localStorage.getItem("enableFade") == "true"
    this.fadeDuration = Number(localStorage.getItem("fadeDuration"))

    this._lightService.currentFaderColors
      .subscribe((res: any) => {
        this.faderColors = res
      })

    this._lightService.currentState
      .subscribe((res: any) => {
        if (!res) return

        this.state = res
        this.inputColor = this.state.color
        this.hexcode = this.rgbToHex(this.inputColor.r, this.inputColor.g, this.inputColor.b)
        this._lightService.setBackgroundColor('#' + this.hexcode)
      })
  }

  public changeRedSlider(event: any) {
    this.calculateHex()
  }

  public changeGreenSlider(event: any) {
    this.calculateHex()
  }

  public changeBlueSlider(event: any) {
    this.calculateHex()
  }

  public changeHexInput() {
    const newColor = this.hexToRgb("#" + this.hexcode)
    this.inputColor = newColor
  }

  public submitColor() {
    if (this.enableFade) {
      this._lightService.changeColorFade(this.inputColor, this.fadeDuration)
      .subscribe((res: any) => {
        console.log(res);
      })
    } else {
      this._lightService.changeColor(this.inputColor)
        .subscribe((res: any) => {
          console.log(res);
        })
    }

    const hex = '#' + this.rgbToHex(this.inputColor.r, this.inputColor.g, this.inputColor.b)
    this._lightService.setBackgroundColor(hex)
  }

  public addFaderColor() {
    this.faderColors.push({ hex: '#' + this.hexcode, color:  Object.assign({}, this.inputColor)})
    this._lightService.changeFaderColors(this.faderColors)
  }

  public saveFadeSettings() {
    localStorage.setItem("enableFade", "" + this.enableFade)
    localStorage.setItem("fadeDuration", this.fadeDuration.toString())
  }

  private calculateHex() {
    this.hexcode = this.rgbToHex(this.inputColor.r, this.inputColor.g, this.inputColor.b)
  }

  private componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  private rgbToHex(r: number, g: number, b: number) {
    return this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }

  private hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const defaultColor: Color = new Color()

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : defaultColor;
  }

}
