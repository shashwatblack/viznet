import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3SandboxComponent } from './d3-sandbox.component';

describe('D3SandboxComponent', () => {
  let component: D3SandboxComponent;
  let fixture: ComponentFixture<D3SandboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [D3SandboxComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3SandboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
