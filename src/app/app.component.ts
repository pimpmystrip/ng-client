import { Component, OnInit, OnDestroy } from '@angular/core';
import { LightService } from './services/light.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  private connection;

  constructor(private _lightService: LightService) { }

  ngOnInit() {
    this._lightService.getState()
      .subscribe((res: any) => {
        this._lightService.changeState(res)
      })

    this.connection = this._lightService.getColorUpdate()
      .subscribe((color: any) => {
        color.r = this.parseColor(color.r)
        color.g = this.parseColor(color.g)
        color.b = this.parseColor(color.b)

        const hex = this.rgbToHex(color.r, color.g, color.b)
        console.log(hex);
        this._lightService.setBackgroundColor(hex)
      })
  }

  ngOnDestroy() {
    this.connection.unsubscribe()
  }

  private componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  private rgbToHex(r: number, g: number, b: number) {
    return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }

  private parseColor(color): number {
    color = Math.round(color)

    if(color > 255) color = 255
    if(color < 0) color = 0

    return color
  }
}
