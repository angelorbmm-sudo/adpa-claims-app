# Preserved verification scripts

These scripts preserve the checks used during the ADPA build. They include construction, authority, accounting, receipts, claim isolation, evidence, agreements, policy imports and dashboard checks.

Some retain original workspace fixture and jsdom dependency paths. Restore the fixtures/dependencies or adjust those paths before rerunning after workspace recovery. These files are developer verification scripts, not runtime app files. No live claim test records were created by the October 3 authority and construction checks.

Run the authority server checks from the project root with `node verification/test-authority.cjs`; its TypeScript and zod dependencies are already declared by the app.
