import {
  spawnSync,
} from 'node:child_process'
import {
  fileURLToPath,
} from 'node:url'

const scriptPath = fileURLToPath(
  new URL(
    '../../../kit/skills/hof-acceptance-review/scripts/find-emit-mismatches.mjs',
    import.meta.url
  )
)

const fixturesPath = fileURLToPath(
  new URL('../../fixtures/find-emit-mismatches/', import.meta.url)
)

describe('find-emit-mismatches.mjs', () => {
  describe('should read both forms of the emits registration', () => {
    const cases = [
      {
        input: { fixtureName: 'registered-by-values' },
        expected: {
          summary: 'MISMATCHES: 0   CONTEXTS CHECKED: 1',
          status: 0,
        },
      },
      {
        input: { fixtureName: 'registered-by-array' },
        expected: {
          summary: 'MISMATCHES: 1   CONTEXTS CHECKED: 1',
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

  describe('should name the event left out of an array registration', () => {
    const cases = [
      { input: { fixtureName: 'registered-by-array' } },
    ]

    test.each(cases)('$input.fixtureName', ({ input }) => {
      const received = String(
        spawnSync('node', [scriptPath, `${fixturesPath}${input.fixtureName}`])
          .stdout
      )

      expect(received)
        .toContain('\'reset\' missing from the component\'s emits')
    })
  })
})
