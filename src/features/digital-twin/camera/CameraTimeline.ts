export class CameraTimeline {
  private isPlaying = false;
  private isPaused = false;
  private progress = 0;
  private duration = 10; // default duration in seconds
  private lastTime = 0;
  private animationFrameId: number | null = null;

  private onUpdateCallback?: (progress: number) => void;
  private onCompleteCallback?: (progress: number) => void;

  public play(
    duration: number,
    onUpdate: (progress: number) => void,
    onComplete: (progress: number) => void
  ): void {
    this.cancel();

    this.isPlaying = true;
    this.isPaused = false;
    this.progress = 0;
    this.duration = duration;
    this.onUpdateCallback = onUpdate;
    this.onCompleteCallback = onComplete;
    this.lastTime = performance.now();

    this.tick();
  }

  public pause(): void {
    if (this.isPlaying && !this.isPaused) {
      this.isPaused = true;
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }
  }

  public resume(): void {
    if (this.isPlaying && this.isPaused) {
      this.isPaused = false;
      this.lastTime = performance.now();
      this.tick();
    }
  }

  public cancel(): void {
    this.isPlaying = false;
    this.isPaused = false;
    this.progress = 0;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.onUpdateCallback) {
      this.onUpdateCallback(0);
    }
  }

  public complete(): void {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.isPaused = false;
      this.progress = 1.0;
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      if (this.onUpdateCallback) {
        this.onUpdateCallback(1.0);
      }
      if (this.onCompleteCallback) {
        this.onCompleteCallback(1.0);
      }
    }
  }

  public getProgress(): number {
    return this.progress;
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      progress: this.progress,
    };
  }

  private tick = (): void => {
    if (!this.isPlaying || this.isPaused) return;

    const now = performance.now();
    const deltaSeconds = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.progress += deltaSeconds / this.duration;

    if (this.progress >= 1.0) {
      this.progress = 1.0;
      if (this.onUpdateCallback) {
        this.onUpdateCallback(1.0);
      }
      this.isPlaying = false;
      if (this.onCompleteCallback) {
        this.onCompleteCallback(1.0);
      }
    } else {
      if (this.onUpdateCallback) {
        this.onUpdateCallback(this.progress);
      }
      this.animationFrameId = requestAnimationFrame(this.tick);
    }
  };
}
