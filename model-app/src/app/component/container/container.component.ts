import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.less']
})
export class ContainerComponent implements OnInit {
  public isOpen: boolean;

  constructor() {
  }

  ngOnInit() {
  }

}
