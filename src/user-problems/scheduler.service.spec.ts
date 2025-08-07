import { SchedulerService } from './scheduler.service';

describe('SchedulerService', () => {
  let service: SchedulerService;
  beforeEach(() => {
    service = new SchedulerService();
  });

  it('should schedule next interval according to SM-2', () => {
    const today = new Date();
    const result = service.scheduleNextReview(
      { interval: 1, repetition: 1, easinessFactor: 2.5 },
      5,
    );
    expect(result.repetition).toBe(2);
    expect(result.interval).toBe(6);
    expect(result.easinessFactor).toBeCloseTo(2.6);
    const expected = new Date(today);
    expected.setDate(today.getDate() + 6);
    expect(result.nextReviewAt.toDateString()).toBe(expected.toDateString());
  });

  it('should reset repetition when quality below 3', () => {
    const result = service.scheduleNextReview(
      { interval: 10, repetition: 5, easinessFactor: 2.5 },
      2,
    );
    expect(result.repetition).toBe(0);
    expect(result.interval).toBe(1);
  });

  it('should not reduce easiness factor below 1.3', () => {
    const res = service.scheduleNextReview(
      { interval: 1, repetition: 1, easinessFactor: 1.3 },
      0,
    );
    expect(res.easinessFactor).toBeGreaterThanOrEqual(1.3);
  });
});
