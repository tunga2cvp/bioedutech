import { TestBed } from '@angular/core/testing';
import { TimerService } from './timer.service';

describe('TimerService', () => {
  let service: TimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimerService);
  });

  afterEach(() => {
    service.stopTimer();
  });

  it('should parse single-unit timer strings', () => {
    expect(service.parseTimerString('30m')).toBe(1800);
    expect(service.parseTimerString('1h')).toBe(3600);
    expect(service.parseTimerString('45s')).toBe(45);
  });

  it('should parse compound timer strings', () => {
    expect(service.parseTimerString('1h30m')).toBe(5400);
    expect(service.parseTimerString('1h 30m')).toBe(5400);
    expect(service.parseTimerString('2h15m30s')).toBe(8130);
  });

  it('should reject invalid or zero-length timer strings', () => {
    expect(service.parseTimerString('')).toBe(0);
    expect(service.parseTimerString('0m')).toBe(0);
    expect(service.parseTimerString('30x')).toBe(0);
    expect(service.parseTimerString('m30')).toBe(0);
  });
});
