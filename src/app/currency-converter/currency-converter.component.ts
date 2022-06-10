import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {
  BehaviorSubject, catchError, debounceTime, EMPTY, mapTo,
  merge, mergeMap, of, takeWhile, tap, withLatestFrom,
} from 'rxjs';

import { CurrencyService } from '../_api/services';
import { CurrencyModel, CurrencyType } from '../_api/models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss']
})
export class CurrencyConverterComponent implements OnInit {

  currencies: CurrencyType[] = [CurrencyType.EUR, CurrencyType.USD, CurrencyType.UAH];

  updatedFieldKey = new BehaviorSubject('currencyAmountOne');
  currencyForm = new FormGroup<{
    currencyOne: FormControl<string>;
    currencyTwo: FormControl<string>;
    currencyAmountOne: FormControl<number>;
    currencyAmountTwo: FormControl<number>;
  }>({
    currencyOne: new FormControl(CurrencyType.UAH, [Validators.required]),
    currencyTwo: new FormControl(CurrencyType.USD, [Validators.required]),
    currencyAmountOne: new FormControl(null, [Validators.min(0)]),
    currencyAmountTwo: new FormControl(null, [Validators.min(0)]),
  });

  constructor(private currencyService: CurrencyService) {
  }

  ngOnInit(): void {

    merge(
      this.currencyForm.get('currencyAmountOne').valueChanges.pipe(mapTo('currencyAmountOne')),
      this.currencyForm.get('currencyAmountTwo').valueChanges.pipe(mapTo('currencyAmountTwo')),
    ).subscribe(this.updatedFieldKey);

    this.currencyForm.valueChanges.pipe(
      debounceTime(250),
      takeWhile(() => this.currencyForm.valid),
      withLatestFrom(this.updatedFieldKey),
      mergeMap(([formValue, updatedFieldKey]) => {
          if (formValue.currencyOne === formValue.currencyTwo || !formValue[updatedFieldKey]) {
            const updateKey = updatedFieldKey === 'currencyAmountOne' ? 'currencyAmountTwo' : 'currencyAmountOne';
            this.currencyForm.patchValue({
              [updateKey]: formValue[updatedFieldKey] || 0
            }, {emitEvent: false});
            return of(null);
          }

          return this.currencyService.getConvertedResult(
            updatedFieldKey === 'currencyAmountOne' ? {
              from: formValue.currencyOne,
              to: formValue.currencyTwo,
              amount: formValue.currencyAmountOne
            } : {
              from: formValue.currencyTwo,
              to: formValue.currencyOne,
              amount: formValue.currencyAmountTwo
            }
          ).pipe(
            tap((data: CurrencyModel) => {
              const updateKey = formValue.currencyOne === data.base ? 'currencyAmountTwo' : 'currencyAmountOne';
              const updateCurrency = formValue.currencyOne === data.base ? formValue.currencyTwo : formValue.currencyOne;
              this.currencyForm.patchValue({
                [updateKey]: data.result[updateCurrency]
              }, {emitEvent: false});
            })
          );
        }
      ),
      catchError((err: HttpErrorResponse) => {
        return EMPTY;
      })
    )
      .subscribe();
  }

}
