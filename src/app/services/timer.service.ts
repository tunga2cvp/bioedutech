import { Injectable } from '@angular/core';
import { Subject, Observable, interval, takeWhile } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TimerConfig {
  duration: number; // Duration in seconds
  onTick?: (secondsRemaining: number) => void;
  onWarning?: (secondsRemaining: number) => void; // Called when 5 minutes or less remain
  onCritical?: (secondsRemaining: number) => void; // Called when 1 minute or less remain
  onTimeUp?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timerSubject = new Subject<number>();
  public timer$ = this.timerSubject.asObservable();
  
  private timerInterval: any = null;
  private secondsRemaining: number = 0;
  private isRunning: boolean = false;
  private initialDuration: number = 0;
  private warningThreshold: number = 300; // Default: 5 minutes (only if duration >= 10 min)
  private criticalThreshold: number = 60; // Default: 1 minute (only if duration >= 2 min)
  private hasWarned: boolean = false;
  private hasCritical: boolean = false;
  
  private config: TimerConfig | null = null;

  constructor() {}

  /**
   * Parse timer string in format "2m", "1h", "30s", "1h30m", "2h15m30s", etc.
   * @param timerString - Format: "2m" (2 minutes), "1h30m" (1 hour 30 minutes)
   * @returns Duration in seconds
   */
  parseTimerString(timerString: string): number {
    if (!timerString) return 0;
    
    timerString = timerString.trim().toLowerCase().replace(/\s+/g, '');
    const regex = /^(?:(\d+(?:\.\d+)?)h)?(?:(\d+(?:\.\d+)?)m)?(?:(\d+(?:\.\d+)?)s)?$/;
    const match = timerString.match(regex);
    
    if (!match) {
      console.warn(`Invalid timer string format: ${timerString}`);
      return 0;
    }
    
    const hours = match[1] ? parseFloat(match[1]) : 0;
    const minutes = match[2] ? parseFloat(match[2]) : 0;
    const seconds = match[3] ? parseFloat(match[3]) : 0;
    const totalSeconds = Math.round(hours * 3600 + minutes * 60 + seconds);

    if (totalSeconds <= 0) {
      console.warn(`Invalid timer string duration: ${timerString}`);
      return 0;
    }

    return totalSeconds;
  }

  /**
   * Calculate dynamic thresholds based on duration
   * - If duration < 5 min: Warning at 50% remaining
   * - If duration < 10 min: Warning at 25% remaining  
   * - If duration >= 10 min: Warning at 5 min remaining
   * - Critical: Always at 1 min or 10% remaining, whichever is more
   */
  private calculateThresholds(duration: number): void {
    if (duration < 300) { // Less than 5 minutes
      // For short exams, warning at 50% remaining
      this.warningThreshold = Math.floor(duration * 0.5);
      console.log(`⏱️ Short exam detected (${duration}s). Warning threshold: ${this.warningThreshold}s`);
    } else if (duration < 600) { // Less than 10 minutes
      // For medium exams, warning at 25% remaining
      this.warningThreshold = Math.floor(duration * 0.25);
      console.log(`⏱️ Medium exam detected (${duration}s). Warning threshold: ${this.warningThreshold}s`);
    } else {
      // For long exams, use standard 5 minutes
      this.warningThreshold = 300;
      console.log(`⏱️ Long exam detected (${duration}s). Warning threshold: 300s (5 min)`);
    }

    // Critical: max of (1 minute or 10% remaining)
    this.criticalThreshold = Math.max(60, Math.floor(duration * 0.1));
    console.log(`⏱️ Critical threshold: ${this.criticalThreshold}s`);
  }

  /**
   * Start timer with configuration
   */
  startTimer(config: TimerConfig): void {
    if (this.isRunning) {
      console.warn('Timer is already running. Stop it first before starting a new one.');
      return;
    }

    this.config = config;
    this.secondsRemaining = config.duration;
    this.initialDuration = config.duration;
    this.isRunning = true;
    this.hasWarned = false;
    this.hasCritical = false;

    // Calculate thresholds based on duration
    this.calculateThresholds(config.duration);

    console.log(`🕐 Timer started: ${this.secondsRemaining} seconds`);

    this.timerInterval = setInterval(() => {
      this.secondsRemaining--;
      this.timerSubject.next(this.secondsRemaining);

      // Call tick callback
      if (this.config?.onTick) {
        this.config.onTick(this.secondsRemaining);
      }

      // Check for warning threshold
      if (this.secondsRemaining <= this.warningThreshold && !this.hasWarned) {
        this.hasWarned = true;
        console.log(`⚠️ Timer warning: ${this.warningThreshold}s or less remaining`);
        if (this.config?.onWarning) {
          this.config.onWarning(this.secondsRemaining);
        }
      }

      // Check for critical threshold
      if (this.secondsRemaining <= this.criticalThreshold && !this.hasCritical) {
        this.hasCritical = true;
        console.log(`🔴 Timer critical: ${this.criticalThreshold}s or less remaining`);
        if (this.config?.onCritical) {
          this.config.onCritical(this.secondsRemaining);
        }
      }

      // Time is up
      if (this.secondsRemaining <= 0) {
        this.stopTimer();
        console.log('⏰ Time is up!');
        if (this.config?.onTimeUp) {
          this.config.onTimeUp();
        }
      }
    }, 1000);
  }

  /**
   * Stop timer
   */
  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isRunning = false;
    console.log('🛑 Timer stopped');
  }

  /**
   * Pause timer
   */
  pauseTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.isRunning = false;
      console.log('⏸️ Timer paused');
    }
  }

  /**
   * Resume timer
   */
  resumeTimer(): void {
    if (!this.isRunning && this.config && this.secondsRemaining > 0) {
      this.isRunning = true;
      console.log('▶️ Timer resumed');
      
      this.timerInterval = setInterval(() => {
        this.secondsRemaining--;
        this.timerSubject.next(this.secondsRemaining);

        if (this.config?.onTick) {
          this.config.onTick(this.secondsRemaining);
        }

        if (this.secondsRemaining <= this.warningThreshold && !this.hasWarned) {
          this.hasWarned = true;
          if (this.config?.onWarning) {
            this.config.onWarning(this.secondsRemaining);
          }
        }

        if (this.secondsRemaining <= this.criticalThreshold && !this.hasCritical) {
          this.hasCritical = true;
          if (this.config?.onCritical) {
            this.config.onCritical(this.secondsRemaining);
          }
        }

        if (this.secondsRemaining <= 0) {
          this.stopTimer();
          if (this.config?.onTimeUp) {
            this.config.onTimeUp();
          }
        }
      }, 1000);
    }
  }

  /**
   * Get current remaining seconds
   */
  getSecondsRemaining(): number {
    return this.secondsRemaining;
  }

  /**
   * Check if timer is running
   */
  isTimerRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Format seconds to human-readable format
   */
  formatSeconds(seconds: number): string {
    if (seconds < 0) seconds = 0;
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }

  /**
   * Get timer info
   */
  getTimerInfo(): any {
    return {
      secondsRemaining: this.secondsRemaining,
      isRunning: this.isRunning,
      formatted: this.formatSeconds(this.secondsRemaining),
      isWarning: this.secondsRemaining <= this.warningThreshold && this.secondsRemaining > this.criticalThreshold,
      isCritical: this.secondsRemaining <= this.criticalThreshold && this.secondsRemaining > 0,
      isTimeUp: this.secondsRemaining <= 0
    };
  }

  /**
   * Cleanup
   */
  ngOnDestroy(): void {
    this.stopTimer();
    this.timerSubject.complete();
  }
}
