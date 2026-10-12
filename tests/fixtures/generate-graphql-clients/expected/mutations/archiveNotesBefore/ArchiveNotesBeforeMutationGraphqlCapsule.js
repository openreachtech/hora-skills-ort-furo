import BaseAppGraphqlCapsule from '~/app/graphql/client/BaseAppGraphqlCapsule.js'

/**
 * ArchiveNotesBefore mutation graphql capsule.
 *
 * @extends {BaseAppGraphqlCapsule<ArchiveNotesBeforeMutationResponseContent>}
 */
export default class ArchiveNotesBeforeMutationGraphqlCapsule extends BaseAppGraphqlCapsule {
  /**
   * get: archiveNotesBeforeValueHash
   *
   * @returns {number | null}
   */
  get archiveNotesBeforeValueHash () {
    return this.content
      ?.archiveNotesBefore
      ?? null
  }
}

/**
 * @typedef {{
 *   archiveNotesBefore: number
 * }} ArchiveNotesBeforeMutationResponseContent
 */
