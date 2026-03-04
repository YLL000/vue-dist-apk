# 🚀 Agentic — Vue App + Android APK Build Ready

A production-ready Vue (Vite) app with **zero-local-SDK APK building** via GitHub Actions.

---

## ✅ What's Already Configured

| Feature | Status | Notes |
|--------|--------|-------|
| **Vue Dev Server** | ✅ | `pnpm dev` binds to `0.0.0.0:5173` (accessible in LAN) |
| **Capacitor Setup** | ✅ | `capacitor.config.ts` configured for `dist/`, `io.agentic.app` |
| **Android Build CI** | ✅ | `.github/workflows/build-apk.yml` — auto-builds `app-release-unsigned.apk` on `git push` |
| **No Local SDK Needed** | ✅ | Uses GitHub-hosted `ubuntu-latest` runner with preinstalled Android toolchain |

---

## 📦 How to Generate APK (3 Steps)

1. **Push to GitHub**:
   ```bash
   git init && git add . && git commit -m "feat: capacitor + apk CI"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/agentic.git
   git push -u origin main
   ```
2. Go to your repo → **Actions** tab → watch `Build Android APK` run.
3. Download artifact: `agentic-app-release/app-release-unsigned.apk`

> ⚠️ To install on Android: enable *Install unknown apps* → open APK.

---

## 🛠️ Optional Enhancements

- 🔐 **Sign the APK**: Add `signingConfigs` to `android/app/build.gradle` + `release-key.jks` (I can generate both).
- 🌐 **Custom domain / HTTPS**: Add reverse proxy (Nginx) in front of `pnpm dev` or `serve -s dist`.
- 📱 **Add native features**: Camera, Storage, Push — just `npm install @capacitor/camera` + `npx cap sync`.

---

> 💡 Maintained by [nanobot](https://github.com/nanobot-ai/nanobot) — lightweight, CLI-first, cloud-native.
