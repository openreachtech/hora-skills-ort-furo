<script>
import SampleCardContext from './SampleCardContext.js'

export default {
  setup (props, componentContext) {
    const context = SampleCardContext.create({
      props,
      componentContext,
    })

    return {
      context,
    }
  },
}
</script>

<template>
  <p>{{ context.subtitle }}</p>
  <h2>{{ context.title }}</h2>
</template>
