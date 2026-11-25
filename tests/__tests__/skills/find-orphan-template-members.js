import {
  spawnSync,
} from 'node:child_process'
import {
  fileURLToPath,
} from 'node:url'

const scriptPath = fileURLToPath(
  new URL(
    '../../../kit/skills/hof-acceptance-review/scripts/find-orphan-template-members.mjs',
    import.meta.url
  )
)

const fixturesPath = fileURLToPath(
  new URL('../../fixtures/find-orphan-template-members/', import.meta.url)
)

describe('find-orphan-template-members.mjs', () => {
  describe('should read only the template outside its comments', () => {
    const cases = [
      {
        input: { fixtureName: 'commented-mention' },
        expected: {
          summary: 'ORPHAN MEMBERS: 0   COMPONENTS CHECKED: 1',
          status: 0,
        },
      },
      {
        input: { fixtureName: 'undefined-member' },
        expected: {
          summary: 'ORPHAN MEMBERS: 1   COMPONENTS CHECKED: 1',
          status: 1,
        },
      },
    ]

    test.each(cases)('$input.fixtureName', ({ input, expected }) => {
      const result = spawnSync('node', [scriptPath, `${fixturesPath}${input.fixtureName}`])

      expect(String(result.stdout))
        .toContain(expected.summary)
      expect(result.status)
        .toBe(expected.status)
    })
  })
})
