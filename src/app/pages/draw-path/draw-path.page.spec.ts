//import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawPathPage } from './draw-path.page';

describe('DrawPathPage', () => {
  let component: DrawPathPage;
  let fixture: ComponentFixture<DrawPathPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawPathPage ],
      //schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawPathPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
