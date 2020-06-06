import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainTreeComponent } from './domain-tree.component';

describe('DomainTreeComponent', () => {
  let component: DomainTreeComponent;
  let fixture: ComponentFixture<DomainTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
