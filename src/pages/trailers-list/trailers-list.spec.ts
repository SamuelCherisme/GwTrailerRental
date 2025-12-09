import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailersList } from './trailers-list';

describe('TrailersList', () => {
  let component: TrailersList;
  let fixture: ComponentFixture<TrailersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailersList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrailersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
