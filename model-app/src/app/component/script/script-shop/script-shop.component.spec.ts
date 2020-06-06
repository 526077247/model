import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptShopComponent } from './script-shop.component';

describe('ScriptShopComponent', () => {
  let component: ScriptShopComponent;
  let fixture: ComponentFixture<ScriptShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
