import BaseAppGraphqlCapsule from '~/app/graphql/client/BaseAppGraphqlCapsule.js'

/**
 * Notes query graphql capsule.
 *
 * @extends {BaseAppGraphqlCapsule<NotesQueryResponseContent>}
 */
export default class NotesQueryGraphqlCapsule extends BaseAppGraphqlCapsule {
  /**
   * get: notesValueHash
   *
   * @returns {Array<schema.graphql.Note>}
   */
  get notesValueHash () {
    return this.content
      ?.notes
      ?? []
  }
}

/**
 * @typedef {{
 *   notes: Array<schema.graphql.Note>
 * }} NotesQueryResponseContent
 */
