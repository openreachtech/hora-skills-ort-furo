import BaseAppGraphqlCapsule from '~/app/graphql/client/BaseAppGraphqlCapsule.js'

/**
 * NoteCounts query graphql capsule.
 *
 * @extends {BaseAppGraphqlCapsule<NoteCountsQueryResponseContent>}
 */
export default class NoteCountsQueryGraphqlCapsule extends BaseAppGraphqlCapsule {
  /**
   * get: noteCountsValueHash
   *
   * @returns {Array<schema.graphql.NoteCount>}
   */
  get noteCountsValueHash () {
    return this.content
      ?.noteCounts
      ?? []
  }
}

/**
 * @typedef {{
 *   noteCounts: Array<schema.graphql.NoteCount>
 * }} NoteCountsQueryResponseContent
 */
