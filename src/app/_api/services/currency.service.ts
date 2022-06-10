import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CurrencyModel } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private readonly basePath: string;

  constructor(private http: HttpClient) {
    this.basePath = `${environment.apiUrl}`;
  }


  fetchMulti(from: string, to: string): Observable<CurrencyModel> {
    const endpoint = `${this.basePath}/fetch-multi?api_key=${environment.apiKey}`;

    const params = new HttpParams().set('from', from).set('to', to);

    return this.http.get<CurrencyModel>(endpoint, { params });
  }

  getConvertedResult(data: {from: string, to: string, amount: number}) {
    const endpoint = `${this.basePath}/convert?api_key=${environment.apiKey}`;

    const params = new HttpParams().set('from', data.from).set('to', data.to).set('amount', data.amount);

    return this.http.get<CurrencyModel>(endpoint, { params });
  }
}
