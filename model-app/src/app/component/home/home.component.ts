import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(
    private snackBar: MatSnackBar,
    private titleService: Title,
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle('主页');
  }

}
