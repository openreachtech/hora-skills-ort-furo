import BaseAppGraphqlCapsule from '~/app/graphql/client/BaseAppGraphqlCapsule.js'

/**
 * DeleteNote mutation graphql capsule.
 *
 * @extends {BaseAppGraphqlCapsule<DeleteNoteMutationResponseContent>}
 */
export default class DeleteNoteMutationGraphqlCapsule extends BaseAppGraphqlCapsule {
  /**
   * get: deleteNoteValueHash
   *
   * @returns {boolean | null}
   */
  get deleteNoteValueHash () {
    return this.content
      ?.deleteNote
      ?? null
  }
}

/**
 * @typedef {{
 *   deleteNote: boolean
 * }} DeleteNoteMutationResponseContent
 */
