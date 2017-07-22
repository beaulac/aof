import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CyRendererComponent } from './cy-renderer.component';

describe('CyRendererComponent', () => {
  let component: CyRendererComponent;
  let fixture: ComponentFixture<CyRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CyRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CyRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
