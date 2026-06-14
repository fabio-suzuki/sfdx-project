---
name: testing-gym-app
description: Test the GymTrainer AI React Native/Expo app end-to-end on Android emulator. Use when verifying gym app UI, workout flows, or database persistence.
---

# Testing GymTrainer AI

## Prerequisites

- Android SDK installed at `~/android-sdk`
- AVD created (Pixel 6, API 35): `avdmanager create avd -n test_device -k "system-images;android-35;google_apis;x86_64" -d pixel_6`
- APK built: `cd gym-app && npx expo run:android` (outputs to `android/app/build/outputs/apk/debug/app-debug.apk`)

## Environment Setup

### Memory
The emulator needs ~2.5GB+ RAM. If the VM has limited free RAM, add swap:
```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Start Emulator
```bash
export ANDROID_HOME=~/android-sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
emulator -avd test_device -no-audio -gpu swiftshader_indirect -no-boot-anim -no-snapshot -no-metrics &
```

Wait for boot: `adb shell getprop sys.boot_completed` returns `1`.

### Start Metro + Install APK
```bash
cd gym-app
adb reverse tcp:8081 tcp:8081  # CRITICAL: emulator needs this to reach Metro
CI=1 npx expo start --port 8081 &
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.gymtrainer.ai/.MainActivity
```

## Key Testing Tips

### Text Input in React Native
`adb shell input text "..."` does NOT work reliably with React Native TextInputs. Use key events instead:
```bash
# Type "40" into a focused field
adb shell input keyevent 67  # backspace to clear
adb shell input keyevent 11  # KEYCODE_4
adb shell input keyevent 7   # KEYCODE_0
```

Key codes: 0=KEYCODE_0(7), 1=KEYCODE_1(8), ..., 9=KEYCODE_9(16), backspace=67, enter=66.

### Finding Element Coordinates
Use UI Automator to find exact tap targets:
```bash
adb shell uiautomator dump /sdcard/ui.xml
adb pull /sdcard/ui.xml /tmp/ui.xml
cat /tmp/ui.xml | tr '>' '\n' | grep -i "button_text"
```
Bounds format: `[left,top][right,bottom]`. Tap center: `((left+right)/2, (top+bottom)/2)`.

### Keyboard Dismissal
Use `KEYCODE_ESCAPE` (keyevent 111) to dismiss keyboard without triggering back navigation. Do NOT use `KEYCODE_BACK` (keyevent 4) when a TextInput is focused — it navigates away.

### Debugger Warning Banners
The "Open debugger to view warnings" banner might block bottom tabs. Dismiss via:
- Computer tool: click the X button on the banner
- Or restart app: `adb shell am force-stop com.gymtrainer.ai && adb shell am start -n com.gymtrainer.ai/.MainActivity`

## Known Issues

- **POP_TO navigation warning**: After tapping "Finalizar" to finish a workout, a navigation warning appears. The workout still saves correctly. The app navigates back fine via the Back button. This might be fixed in future versions.
- **System UI not responding**: On swap-backed VMs, the emulator's System UI may show "not responding" dialogs. Use `adb shell am broadcast -a android.intent.action.CLOSE_SYSTEM_DIALOGS` or just wait/dismiss.
- **Slow bundling**: First load after app restart takes 15-30s for Metro to bundle. Wait for the loading spinner ("Preparando...") to complete.

## Test Flow

1. **Home Screen**: Verify "Bora treinar!" header, "Gerar Novo Treino com IA" button, bottom tabs
2. **Generate Workout**: Tap generate → select focus (e.g., "Peito + Tríceps") → tap "Gerar Treino"
3. **Execute Sets**: Input weight via keyevent, tap checkmark → verify rest timer appears → skip timer
4. **Finish Workout**: Tap "Finalizar" → confirm in alert → verify "Concluído" badge in history
5. **Performance**: Navigate to Performance tab → verify stats (treinos count, volume, distribution chart)

## Devin Secrets Needed

No secrets required — the app is fully local with no external API calls.
