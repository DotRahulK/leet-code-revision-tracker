import { Injectable, Logger } from '@nestjs/common';

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
  private readonly logger = new Logger(SchedulerService.name);

  scheduleNextReview(current: ScheduleState, quality: number): ScheduleResult {
    this.logger.debug(
      `Calculating next review with quality ${quality} and state ${JSON.stringify(current)}`,
    );
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

    const result = { interval, repetition, easinessFactor, nextReviewAt };
    this.logger.debug(
      `Next review scheduled on ${nextReviewAt.toISOString()} with interval ${interval}`,
    );
    return result;
  }
}
