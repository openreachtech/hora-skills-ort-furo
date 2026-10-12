import BaseAppGraphqlCapsule from '~/app/graphql/client/BaseAppGraphqlCapsule.js'

/**
 * CreateNote mutation graphql capsule.
 *
 * @extends {BaseAppGraphqlCapsule<CreateNoteMutationResponseContent>}
 */
export default class CreateNoteMutationGraphqlCapsule extends BaseAppGraphqlCapsule {
  /**
   * get: createNoteValueHash
   *
   * @returns {schema.graphql.Note | null}
   */
  get createNoteValueHash () {
    return this.content
      ?.createNote
      ?? null
  }

  /**
   * get: id
   *
   * @returns {string | null}
   */
  get id () {
    return this.createNoteValueHash
      ?.id
      ?? null
  }

  /**
   * get: title
   *
   * @returns {string | null}
   */
  get title () {
    return this.createNoteValueHash
      ?.title
      ?? null
  }

  /**
   * get: body
   *
   * @returns {string | null}
   */
  get body () {
    return this.createNoteValueHash
      ?.body
      ?? null
  }
}

/**
 * @typedef {{
 *   createNote: schema.graphql.Note
 * }} CreateNoteMutationResponseContent
 */
