<script>
import SampleToggleContext from './SampleToggleContext.js'

export default {
  emits: Object.values(SampleToggleContext.EMIT_EVENT_NAME),

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
