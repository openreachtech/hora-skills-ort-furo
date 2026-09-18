import {
  spawnSync,
} from 'node:child_process'
import {
  fileURLToPath,
} from 'node:url'

const scriptPath = fileURLToPath(
  new URL(
    '../../../kit/skills/hof-acceptance-review/scripts/find-unused-operations.mjs',
    import.meta.url
  )
)

const fixturesPath = fileURLToPath(
  new URL('../../fixtures/find-unused-operations/', import.meta.url)
)

/*
 * The exit code cannot tell this suite anything: it is 1 whether or not the subscriptions are
 * enumerated, because a Launcher-led operation is unreached in both fixtures. So the summary line
 * is what is read.
 *
 * Both fixtures carry two operations led by a Launcher and two led by a Subscriber, and a screen
 * reaching one of each. Reading only Launcher.js counts two operations where there are four, and
 * the unreached subscription is reported as nothing at all.
 */
describe('find-unused-operations.mjs', () => {
  describe('should count every operation, whatever class leads its trio', () => {
    const cases = [
      {
        input: { fixtureName: 'both-kinds' },
        expected: 'UNREACHED OPERATIONS: 2   EXCLUDED: 0   STALE: 0   OPERATIONS: 4',
      },
      {
        input: { fixtureName: 'excluded-subscriber' },
        expected: 'UNREACHED OPERATIONS: 1   EXCLUDED: 1   STALE: 0   OPERATIONS: 4',
      },
    ]

    test.each(cases)('$input.fixtureName', ({ input, expected }) => {
      const received = String(
        spawnSync('node', [scriptPath, `${fixturesPath}${input.fixtureName}`])
          .stdout
      )

      expect(received)
        .toContain(expected)
    })
  })

  describe('should name a subscription that no screen reaches', () => {
    const cases = [
      { input: { fixtureName: 'both-kinds' } },
    ]

    test.each(cases)('$input.fixtureName', ({ input }) => {
      const received = String(
        spawnSync('node', [scriptPath, `${fixturesPath}${input.fixtureName}`])
          .stdout
      )

      expect(received)
        .toContain('OnUnreachedThingGraphqlSubscriber')
    })
  })
})
