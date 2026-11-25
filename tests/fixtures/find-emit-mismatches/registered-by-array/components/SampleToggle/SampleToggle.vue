<script>
import SampleToggleContext from './SampleToggleContext.js'

export default {
  emits: [
    SampleToggleContext.EMIT_EVENT_NAME.TOGGLE,
  ],

  setup (props, componentContext) {
    const context = SampleToggleContext.create({
      props,
      componentContext,
    })
      .setupComponent()

    return {
      context,
    }
  },
}
</script>
