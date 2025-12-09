import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerDetails } from './trailers-details';

describe('TrailerDetails', () => {
  let component: TrailerDetails;
  let fixture: ComponentFixture<TrailerDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailerDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrailerDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
