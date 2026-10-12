import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/public/**/*.test.ts', 'tests/hidden/**/*.test.ts'],
  },
})
