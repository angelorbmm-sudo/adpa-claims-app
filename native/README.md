# ADPA cross-platform capture - source handoff

## What is ready and what is not

This directory contains native **starter source projects**, not compiled, signed, installed or field-validated applications. The ADPA web workflow and shared scan importer/geometry calculations are tested. This environment has no Xcode, iOS SDK, Android SDK or Gradle toolchain, so native compilation and phone performance are **unverified**. Do not call these connectors live or production-ready.

No developer-account purchase, AI subscription, paid scanner, paid cloud endpoint or automatic upload was activated. Both companions work toward an offline file-export flow: capture locally, save ADPA scan JSON, and import it into the web app. This avoids embedding credentials or claim-access tokens in a phone bridge before the deployment architecture is approved.

| Capture route | Source delivered | What Jose needs to do |
| --- | --- | --- |
| Apple LiDAR | UIKit RoomPlan capture controller, support/permission checks, processed-room callback, conservative wall-outline adapter, original RoomPlan JSON export, ADPA version 2 export, XcodeGen project spec | Build on Mac/Xcode, configure signing and bundle ID, test a supported device, validate geometry/height and lifecycle behavior, then install/distribute |
| Android | Java ARCore optional app, camera background renderer, support/install/permission checks, runtime Depth check, tracked floor-corner anchors, separately measured height, local document export, Gradle source project | Build with Android Studio, verify SDK/Gradle versions, test supported Samsung/Pixel devices and fallback cases, fix hardware/runtime issues, then install/distribute |
| Other devices / no depth | ADPA camera/video/voice and rectangular measurements; manual polygon coordinates, verified source and custom scope quantities | Already available in the web development build; validate actual camera/microphone behavior on target browsers |

## Apple companion

1. On a Mac with Xcode and an iOS SDK, install/use XcodeGen and run `xcodegen generate` in `native/ios`.
2. Open the generated project, set the development team and a registered unique bundle identifier. Review the generated Info.plist and privacy declarations before distribution.
3. Build for a supported LiDAR-equipped iPhone/iPad. `RoomCaptureSession.isSupported` is checked on the actual device; a browser or brand string is not used to infer support.
4. Enter a room name, grant camera permission, scan one room, then Stop & process. The system view processes the scan and provides `CapturedRoom`.
5. Export the original RoomPlan JSON. Export ADPA scan JSON only for a single straight-wall room with consistent wall heights and a level ceiling. The adapter joins endpoint candidates within 0.20 m. This is a conservative closure tolerance, **not an accuracy guarantee**. Disconnected outlines and varying heights are refused; curved walls/slopes/multiple levels require manual handling.
6. Keep both exports. Import only `adpa-scan.json` into ADPA. The original `roomplan-original.json` preserves native surface data for further adapter work; it is not directly accepted by the ADPA importer.

The first adapter projects wall centers/endpoints to an X/Z outline and uses a candidate uniform wall height. It does not establish an exact floor/ceiling boundary, concealed construction, or damage. Door/window/opening deductions are deliberately zero, with an explicit warning to inspect source and enter deductions. Shared validation rejects crossing or degenerate floor outlines. Verify source geometry against field measurements before any scope is relied on.

## Android companion

1. Open `native/android` in Android Studio. Source pins Android Gradle Plugin 8.6.1, compile/target SDK 35, minimum SDK 26, ARCore 1.48.0 and Java 17. Use a compatible Gradle installation (8.7 for this AGP baseline) and generate a wrapper locally if needed. No wrapper binary or signing key is committed. Review supported toolchain/security updates before distribution.
2. The manifest declares AR optional. Devices without ARCore can still use ADPA's web manual route; the companion explains the fallback rather than claiming to scan on unsupported hardware.
3. Start/retry performs ARCore availability, installation and camera-permission checks. On resume it configures plane tracking, checks Depth support and enables Depth if supported. Absence of Depth is stated explicitly; tracked-plane capture remains a different method from physical LiDAR.
4. Slowly map the floor, then aim the center crosshair at corners in order and tap Add floor corner. The first point must be on a detected upward horizontal plane. Subsequent depth hits must be at the established floor level. Anchors keep candidate point positions in AR space; tracking pauses block further capture/export. Undo corrects the last corner. Do not duplicate the first corner.
5. Enter a **separately field-measured** height in feet. Export saves an ADPA version 2 JSON through Android's document picker. Coordinates and height in the file are meters. The app does not send scans, images, voice, claim details or keys to a server.
6. Import into ADPA and inspect the polygon; measure height and openings; verify source and quantities. The shared web importer rejects malformed/crossing outlines. The Android project is guided measurement, not automatic room/material recognition.

## Shared scan format

Version 1 rectangular imports remain supported. Version 2 uses:

- `version: 2`, `scanId`, `provider`, `captureMethod`, `units` (`m` or `ft`), ISO `capturedAt`, `warnings`, and `rooms`.
- `captureMethod`: `apple_roomplan`, `android_arcore`, or `manual_polygon`.
- Each room has `name`, ordered `points` of `{x,z}`, `height`, `openingsArea`, `heightSource`, and `notes`.
- Outline closure is implicit; do not repeat the first point. The polygon must be simple and nonzero, without duplicate/touching/crossing edges. No more than 100 points per room or 100 rooms per file. Import file limit is 1 MB. Unknown top-level/room keys are refused, including accidental secrets.
- Unit conversion applies to coordinates/heights and squares the factor for opening areas. All editable web measurements are feet/SF. Floor area uses the actual polygon, not its bounding rectangle. Uniform-height walls use polygon perimeter times height minus opening deductions. Level ceilings use projected floor area; sloped surfaces require custom quantities.
- Import always clears verification. Changing coordinates, height or openings clears it again, records inspector edits to scan-derived geometry, and requires re-review before scope transfer. Original scan bytes and SHA-256 are preserved locally as evidence, with duplicate imports prevented.

Synthetic fixtures are in `native/fixtures`; they are interoperability tests, not actual captures. No native hardware accuracy claim is based on them.

## Current verification

- 105 automated JavaScript/server tests pass, including versioned imports, metric conversion, concave geometry, winding/translation, invalid shape rejection, review gates, source provenance and draft packet export.
- Production web build passes.
- Chromium workflow test passes Apple fixture import, Android 90 SF L-shape import, source fingerprint/local reopen, duplicate prevention, scope-review packet download, malformed scan rejection, manual 50 SF outline, and 390px mobile width without overflow or JavaScript errors.
- Android Java files pass a Java grammar parse; Android manifest and XcodeGen YAML parse. **Syntax parsing is not compilation or device validation.** Swift source has been reviewed but cannot be compiled in this environment.

## Jose's acceptance checklist before enabling native capture

- [ ] Compile both native projects using real platform toolchains; resolve SDK/signing issues.
- [ ] Test supported and unsupported devices; camera denied/revoked; AR services missing; app background/resume; export canceled; low storage; tracking loss; device rotation/recreation.
- [ ] Compare measured rectangles, rotated rooms, L shapes, openings and height with a laser/tape reference. Record actual errors and have Peter approve fit-for-purpose tolerances; no tolerance is invented here.
- [ ] Test RoomPlan failure to close, irregular heights, curved walls, slopes, mirrors, glass, dark rooms, smoke/debris and occlusion. Refuse unsupported geometry instead of filling it with guessed dimensions.
- [ ] Confirm Android floor-plane selection, anchor drift, corner ordering, incorrect plane/table selection and depth-unavailable fallback. Clearly distinguish depth estimates from hardware LiDAR.
- [ ] Connect authenticated shared media storage, original verification and retention; current originals remain browser-local.
- [ ] Integrate into the current ADPA/HomeBack app, including login/claims and authorized record sharing; do not embed the web app in an unrestricted native WebView.
- [ ] Connect authorized Xactimate catalog/pricing/import/export and approved training retrieval when ready. No paid connector is enabled by this change.

Official implementation references:
- https://developer.apple.com/augmented-reality/roomplan/
- https://developer.apple.com/documentation/roomplan/roomcaptureviewdelegate
- https://developer.apple.com/documentation/roomplan/roomcapturesession/issupported
- https://developers.google.com/ar/develop/java/enable-arcore
- https://developers.google.com/ar/develop/java/depth/developer-guide
- https://developers.google.com/ar/develop/java/hit-test/developer-guide
