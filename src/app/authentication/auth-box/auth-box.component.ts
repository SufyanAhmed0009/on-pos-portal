import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'auth-box',
  templateUrl: './auth-box.component.html',
  styleUrls: ['./auth-box.component.css']
})
export class AuthBoxComponent implements OnInit, OnChanges {

  /* OBSERVABLE FOR SWITCHING TO HANDSET MODE */
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  /* LANGUAGE VARIABLE */
  @Input('langDir') langDir = "ltr";

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.langDir = changes.langDir.currentValue;
  }

}
