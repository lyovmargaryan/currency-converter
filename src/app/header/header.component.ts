import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { interval, map, mergeMap, Observable, startWith } from 'rxjs';

import { CurrencyService } from '../_api/services';
import { CurrencyResult } from '../_api/models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  currencies$: Observable<CurrencyResult>

  constructor(private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.currencies$ = interval(60 * 1000 * 10).pipe(
      startWith(0),
      mergeMap(() => this.currencyService.fetchMulti('UAH', 'EUR,USD').pipe(
        map(({ results }) => results)
      ))
    )
  }
}
