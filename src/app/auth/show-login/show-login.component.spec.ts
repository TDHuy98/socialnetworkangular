import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLoginComponent } from './show-login.component';

describe('ShowLoginComponent', () => {
  let component: ShowLoginComponent;
  let fixture: ComponentFixture<ShowLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
