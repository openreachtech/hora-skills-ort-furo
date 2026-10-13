import {
  spawnSync,
} from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  fileURLToPath,
} from 'node:url'

const scriptPath = fileURLToPath(
  new URL(
    '../../../kit/skills/hof-graphql/references/generate-graphql-clients.js',
    import.meta.url
  )
)

const fixturesPath = fileURLToPath(
  new URL('../../fixtures/generate-graphql-clients/', import.meta.url)
)

/*
 * The Capsule is read whole against the one written out under `expected/`, so a getter that should
 * not be there fails the case as surely as a wrong type does.
 *
 * The fixture schema returns an object, a list and a built-in scalar from its operations. Only an
 * object root has fields to read, and the generator once took every root for one.
 */
describe('generate-graphql-clients.js', () => {
  describe('should render a field getter for each field of an object root', () => {
    const outputPath = fs.mkdtempSync(path.join(os.tmpdir(), 'generate-graphql-clients-'))

    afterAll(() => {
      fs.rmSync(outputPath, {
        recursive: true,
        force: true,
      })
    })

    const cases = [
      {
        input: {
          operationName: 'note',
          capsulePath: 'queries/note/NoteQueryGraphqlCapsule.js',
        },
      },
      {
        input: {
          operationName: 'createNote',
          capsulePath: 'mutations/createNote/CreateNoteMutationGraphqlCapsule.js',
        },
      },
    ]

    test.each(cases)('$input.operationName', ({ input }) => {
      const expected = fs.readFileSync(`${fixturesPath}expected/${input.capsulePath}`, 'utf8')

      spawnSync('node', [scriptPath, `${fixturesPath}schemas`, '--out', outputPath, '--target', input.operationName])

      const received = fs.readFileSync(`${outputPath}/${input.capsulePath}`, 'utf8')

      expect(received)
        .toBe(expected)
    })
  })

  describe('should render a list root as an array that falls back to []', () => {
    const outputPath = fs.mkdtempSync(path.join(os.tmpdir(), 'generate-graphql-clients-'))

    afterAll(() => {
      fs.rmSync(outputPath, {
        recursive: true,
        force: true,
      })
    })

    const cases = [
      {
        input: {
          operationName: 'notes',
          capsulePath: 'queries/notes/NotesQueryGraphqlCapsule.js',
        },
      },
      {
        input: {
          operationName: 'noteCounts',
          capsulePath: 'queries/noteCounts/NoteCountsQueryGraphqlCapsule.js',
        },
      },
    ]

    test.each(cases)('$input.operationName', ({ input }) => {
      const expected = fs.readFileSync(`${fixturesPath}expected/${input.capsulePath}`, 'utf8')

      spawnSync('node', [scriptPath, `${fixturesPath}schemas`, '--out', outputPath, '--target', input.operationName])

      const received = fs.readFileSync(`${outputPath}/${input.capsulePath}`, 'utf8')

      expect(received)
        .toBe(expected)
    })
  })

  describe('should render a built-in scalar root with its JSDoc type', () => {
    const outputPath = fs.mkdtempSync(path.join(os.tmpdir(), 'generate-graphql-clients-'))

    afterAll(() => {
      fs.rmSync(outputPath, {
        recursive: true,
        force: true,
      })
    })

    const cases = [
      {
        input: {
          operationName: 'deleteNote',
          capsulePath: 'mutations/deleteNote/DeleteNoteMutationGraphqlCapsule.js',
        },
      },
      {
        input: {
          operationName: 'archiveNotesBefore',
          capsulePath: 'mutations/archiveNotesBefore/ArchiveNotesBeforeMutationGraphqlCapsule.js',
        },
      },
    ]

    test.each(cases)('$input.operationName', ({ input }) => {
      const expected = fs.readFileSync(`${fixturesPath}expected/${input.capsulePath}`, 'utf8')

      spawnSync('node', [scriptPath, `${fixturesPath}schemas`, '--out', outputPath, '--target', input.operationName])

      const received = fs.readFileSync(`${outputPath}/${input.capsulePath}`, 'utf8')

      expect(received)
        .toBe(expected)
    })
  })
})
