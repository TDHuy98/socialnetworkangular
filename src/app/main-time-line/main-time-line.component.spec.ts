import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTimeLineComponent } from './main-time-line.component';

describe('MainTimeLineComponent', () => {
  let component: MainTimeLineComponent;
  let fixture: ComponentFixture<MainTimeLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainTimeLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainTimeLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
