import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordSuccessComponent } from './change-password-success.component';

describe('ChangePasswordSuccessComponent', () => {
  let component: ChangePasswordSuccessComponent;
  let fixture: ComponentFixture<ChangePasswordSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePasswordSuccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
