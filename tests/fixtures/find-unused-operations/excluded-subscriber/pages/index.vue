<script>
import ReachedThingQueryGraphqlPayload from '~/app/graphql/client/queries/reachedThing/ReachedThingQueryGraphqlPayload.js'
import OnReachedThingGraphqlSubscriber from '~/app/graphql/client/subscriptions/onReachedThing/OnReachedThingGraphqlSubscriber.js'

export default {
  setup () {
    return { ReachedThingQueryGraphqlPayload, OnReachedThingGraphqlSubscriber }
  },
}
</script>
