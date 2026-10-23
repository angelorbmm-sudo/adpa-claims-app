# Documentation tasks

`lifeNextActions` derives tasks from the selected property's contents, materials and equipment records. It flags missing evidence references, missing replacement prices, unreviewed details, and high-value lines (at least $1,000) without recorded purchase evidence. High-value tasks sort first.

`task` mutations persist owner-entered assignment labels, status and notes. Labels do not send assignments. Missing references are not proof that evidence does not exist, and referenced evidence is not authenticated by this feature.

Fix the supporting item/receipt record to clear ordinary gaps. Purchase-evidence tasks alone may be marked Reviewed complete with reviewed alternative-proof notes; a receipt is not always available or required. Changing the status does not invent a document or determine coverage. Reviewed decisions remain separate from active gaps.

Stored `taskReviews` are optional for older accounts and retained in JSON exports. Preserve same-origin/authentication/version guards, same-property task lookup, status validation, capacity checks and audit bounds when porting.
