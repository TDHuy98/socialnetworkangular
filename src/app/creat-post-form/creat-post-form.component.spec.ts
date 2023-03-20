import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatPostFormComponent } from './creat-post-form.component';

describe('CreatPostFormComponent', () => {
  let component: CreatPostFormComponent;
  let fixture: ComponentFixture<CreatPostFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatPostFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatPostFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
