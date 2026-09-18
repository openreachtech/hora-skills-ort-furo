import {
  spawnSync,
} from 'node:child_process'
import {
  fileURLToPath,
} from 'node:url'

const scriptPath = fileURLToPath(
  new URL(
    '../../../kit/skills/hof-e2e-test-specification/scripts/check-scenario-coverage.mjs',
    import.meta.url
  )
)

const fixturesPath = fileURLToPath(
  new URL('../../fixtures/check-scenario-coverage/', import.meta.url)
)

/*
 * The script is driven the way Phase 4 drives it — one argument in, an exit code out — because the
 * exit code is the whole of what the phase reads from it.
 *
 * The four `*-moved` fixtures are why this suite exists. Each moves one label or one heading depth
 * of the schema the script parses, which is what a specification settled differently later looks
 * like from here. Before the guards that hold them to 2, `heading-depth-moved` reported every
 * operation as uncovered and exited 1 — a specification that was correct, reported as broken.
 */
describe('check-scenario-coverage.mjs', () => {
  describe('should exit with the code its contract states', () => {
    const cases = [
      { input: { fixtureName: 'clean' }, expected: 0 },
      { input: { fixtureName: 'findings' }, expected: 1 },
      { input: { fixtureName: 'uncovered-subscription' }, expected: 1 },
      { input: { fixtureName: 'covers-label-moved' }, expected: 2 },
      { input: { fixtureName: 'heading-depth-moved' }, expected: 2 },
      { input: { fixtureName: 'status-label-moved' }, expected: 2 },
      { input: { fixtureName: 'exclusion-table-moved' }, expected: 2 },
      { input: { fixtureName: 'no-specification' }, expected: 2 },
      { input: { fixtureName: 'index-only' }, expected: 2 },
      { input: { fixtureName: 'no-operations' }, expected: 2 },
    ]

    test.each(cases)('$input.fixtureName', ({ input, expected }) => {
      const received = spawnSync('node', [scriptPath, `${fixturesPath}${input.fixtureName}`])
        .status

      expect(received)
        .toBe(expected)
    })
  })

  describe('should report no finding where the schema it reads has moved', () => {
    const cases = [
      { input: { fixtureName: 'covers-label-moved' } },
      { input: { fixtureName: 'heading-depth-moved' } },
      { input: { fixtureName: 'status-label-moved' } },
      { input: { fixtureName: 'exclusion-table-moved' } },
    ]

    test.each(cases)('$input.fixtureName', ({ input }) => {
      const received = String(
        spawnSync('node', [scriptPath, `${fixturesPath}${input.fixtureName}`])
          .stdout
      )

      expect(received)
        .toContain('FINDINGS: 0')
    })
  })
})
