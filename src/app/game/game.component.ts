import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, interval, Observable, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  btnSub: any;
  times: number[] = [];
  timeObervable: any;
  tempVal = 0;
  gameSubscription: any;
  average: number = 0;

  num1: number = 2;
  num2: number = 3;

  alertFlag: Boolean = false;
  incorrect: Boolean = false;

  @ViewChild('res', { static: true })
  resInput!: ElementRef;

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.generateRandomNumber()
    this.timeObervable = timer(0, 100);
    this.gameSubscription = this.timeObervable.subscribe({
      next: (val: number) => {
        this.tempVal = val;
      },
    });
    this.initializeInputListener();
  }

  calculateAvg() {
    let time = this.times.reduce((acc, item) => acc + item, 0);
    return time / (this.times.length * 10);
  }

  generateRandomNumber(): void {
    this.num1 = Math.floor(Math.random() * 10);
    this.num2 = Math.floor(Math.random() * 10);
    this.resInput.nativeElement.focus()

  }

  initializeInputListener() {
    fromEvent(this.resInput.nativeElement, 'keyup').subscribe({
      next: (e: any) => {
        let inputValue = Number(e.target.value);
        if (this.alertFlag) {
          e.preventDefault();
        }
        if (
          e.target.value.length &&
          !isNaN(inputValue) &&
          inputValue === this.num1 + this.num2 &&
          !this.alertFlag
        ) {
          this.alertFlag = true;
          this.incorrect = false;
          this.times.push(this.tempVal);
          this.gameSubscription.unsubscribe();
          this.tempVal = 0;
          this.average = this.calculateAvg();
          timer(1000).subscribe((val) => {
            this.alertFlag = false;
            e.target.value = '';
            this.generateRandomNumber();
            this.gameSubscription = this.timeObervable.subscribe({
              next: (val: number) => {
                this.tempVal = val;
              },
            });
            setTimeout(() => {
              this.resInput.nativeElement.focus()
            },0);  
          });
        } else {
          this.incorrect = true;
        }
      },
    });
  }
}
