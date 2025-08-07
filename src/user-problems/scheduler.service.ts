import { Injectable } from '@nestjs/common';

export interface ScheduleState {
  interval: number;
  repetition: number;
  easinessFactor: number;
}

export interface ScheduleResult extends ScheduleState {
  nextReviewAt: Date;
}

@Injectable()
export class SchedulerService {
  scheduleNextReview(current: ScheduleState, quality: number): ScheduleResult {
    const today = new Date();
    let { interval, repetition, easinessFactor } = current;

    if (quality < 3) {
      repetition = 0;
      interval = 1;
    } else {
      repetition += 1;
      if (repetition === 1) {
        interval = 1;
      } else if (repetition === 2) {
        interval = 6;
      } else {
        interval = Math.round(interval * easinessFactor);
      }
    }

    easinessFactor =
      easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easinessFactor < 1.3) {
      easinessFactor = 1.3;
    }

    const nextReviewAt = new Date(today);
    nextReviewAt.setDate(today.getDate() + interval);

    return { interval, repetition, easinessFactor, nextReviewAt };
  }
}
