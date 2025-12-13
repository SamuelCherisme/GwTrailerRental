import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTrailers } from './admin-trailers';

describe('AdminTrailers', () => {
  let component: AdminTrailers;
  let fixture: ComponentFixture<AdminTrailers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTrailers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTrailers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
