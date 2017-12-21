import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Color } from '../models/color';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

@Injectable()
export class LightService {

  private url = "http://192.168.0.8:8008"
  private socket

  /* State */
  private stateSource = new BehaviorSubject<any>(null)
  currentState = this.stateSource.asObservable()

  /* Fader colors */
  private faderColorsSource = new BehaviorSubject<any []>([])
  currentFaderColors = this.faderColorsSource.asObservable()

  constructor(private _httpClient: HttpClient) { }

  public changeState(state: any) {
    this.stateSource.next(state)
  }

  public changeFaderColors(colors: string []) {
    this.faderColorsSource.next(colors)
  }

  public changeColor(newColor: Color) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')

    return this._httpClient.post(this.url + '/set', newColor, { headers })
  }

  public changeColorFade(newColor: Color, duration: number) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')

    const body = {
      color: newColor,
      duration: duration
    }

    return this._httpClient.post(this.url + '/fade', body, { headers })
  }

  public changeBrightness(brightness: number) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')

    return this._httpClient.post(this.url + '/brightness', { brightness: brightness }, { headers })
  }

  public setFadeColors(faderColors: any [], duration: number, interval: number) {
    console.log(faderColors);
    const body = {
      duration: duration,
      interval: interval,
      colors: faderColors.map(faderColor => faderColor.color)
    }

    console.log(body);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')

    return this._httpClient.post(this.url + '/fadeColors', body, { headers })
  }

  public getColor() {
    return this._httpClient.get(this.url + '/currentColor')
  }

  public getState() {
    return this._httpClient.get(this.url + '/state')
  }

  public setBackgroundColor(hex: string) {
    let body = document.getElementsByTagName('body')[0];
    let html = document.getElementsByTagName('html')[0];
    let addrBar = document.getElementById('addr-theme')

    body.style.backgroundColor = hex
    html.style.backgroundColor = hex
    addrBar.setAttribute('content', hex)
  }

  public getColorUpdate() {
    let observable = new Observable(observer => {
      this.socket = io(this.url)

      this.socket.on('updateColor', (data) => {
        observer.next(data)
      })

      return () => {
        this.socket.disconnect()
      }
    })

    return observable
  }

}
