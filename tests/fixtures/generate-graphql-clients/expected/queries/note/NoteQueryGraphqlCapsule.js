import BaseAppGraphqlCapsule from '~/app/graphql/client/BaseAppGraphqlCapsule.js'

/**
 * Note query graphql capsule.
 *
 * @extends {BaseAppGraphqlCapsule<NoteQueryResponseContent>}
 */
export default class NoteQueryGraphqlCapsule extends BaseAppGraphqlCapsule {
  /**
   * get: noteValueHash
   *
   * @returns {schema.graphql.Note | null}
   */
  get noteValueHash () {
    return this.content
      ?.note
      ?? null
  }

  /**
   * get: id
   *
   * @returns {string | null}
   */
  get id () {
    return this.noteValueHash
      ?.id
      ?? null
  }

  /**
   * get: title
   *
   * @returns {string | null}
   */
  get title () {
    return this.noteValueHash
      ?.title
      ?? null
  }

  /**
   * get: body
   *
   * @returns {string | null}
   */
  get body () {
    return this.noteValueHash
      ?.body
      ?? null
  }
}

/**
 * @typedef {{
 *   note: schema.graphql.Note
 * }} NoteQueryResponseContent
 */
