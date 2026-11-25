export default class SampleToggleContext {
  static get EMIT_EVENT_NAME () {
    return {
      TOGGLE: 'toggle',
      RESET: 'reset',
    }
  }

  toggle () {
    this.emit(this.EMIT_EVENT_NAME.TOGGLE)
  }

  reset () {
    this.emit(this.EMIT_EVENT_NAME.RESET)
  }
}
