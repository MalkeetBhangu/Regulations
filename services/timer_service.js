/**
 * Timers Service to keep the track of timers used throughout the application.
 * @Author Logicease
 */
class TimerService {
  constructor() {
    this.Timers = {};
  }

  /**
   * Adds new timer
   * @param {*} key
   * @param {*} timer
   */
  addTimer(key, timer) {
    this.Timers[key] = timer;
  }

  /**
   * Gets timer with the matching key
   * @param {*} key
   */
  getTimer(key) {
    return this.Timers[key];
  }

  /**
   * Deletes the timer with the matching key
   * @param {*} key
   */
  deleteTimer(key) {
    delete this.Timers[key];
  }
}

export default new TimerService();
