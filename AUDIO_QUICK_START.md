# 🎵 Audio System - Quick Start Guide

## Where to Find Audio Controls

**Location**: Bottom-right corner of the screen

You should see **THREE panels stacked vertically**:

```
┌─────────────────────────────┐
│  🎵 Background Music        │  ← PURPLE panel
│  [🎵] ═══════○═══ 35%      │
└─────────────────────────────┘

┌─────────────────────────────┐
│  🔊 Sound Effects           │  ← CYAN panel  
│  [🔊] ═══════○═══ 60%      │
└─────────────────────────────┘

┌─────────────────────────────┐
│    🎵 Test Sound            │  ← GREEN button
└─────────────────────────────┘
```

---

## Step-by-Step First Use

### Step 1: Start the Music
1. Find the **PURPLE panel** (top panel)
2. Click the **purple music icon** 🎵
3. **Listen** - you should hear epic orchestral music!
4. The icon will **pulse** when music is playing
5. Text changes to "🎵 Music Playing"

**If no sound**: Check volume sliders, check system volume

---

### Step 2: Test Sound Effects  
1. Find the **GREEN button** (bottom panel)
2. Click **"🎵 Test Sound"**
3. **Listen** - you should hear a heroic "ding!" sound
4. Click it multiple times - should play each time

**If no sound**: 
- Increase cyan slider to 60%+
- Check if cyan speaker icon is crossed out
- If crossed out = muted, click to unmute

---

### Step 3: Test Navigation Sounds
1. Look at **bottom navigation bar** (Galaxy Map, Resources, Governance, etc.)
2. Click **"RESOURCES"**
3. **Listen** - soft UI click sound
4. Click **"MISSIONS"**  
5. **Listen** - same soft click
6. Try other buttons - all same sound

**If no sound**: Same as Step 2

---

### Step 4: Test Accept Mission Sound
1. Click **"MISSIONS"** in bottom nav
2. Find an available mission (not active)
3. Click **"Accept Mission"** button
4. **Listen** - heroic confirmation sound (same as test sound)

---

## Volume Controls

### Music Volume (Purple Slider)
- **Recommended**: 30-40%
- **Drag slider** left/right to adjust
- **Number updates** in real-time
- Music gets louder/quieter immediately

### SFX Volume (Cyan Slider)
- **Recommended**: 50-70%
- **Drag slider** left/right to adjust
- Click "Test Sound" to hear changes
- Higher = louder button sounds

---

## Mute Controls

### Mute Music
- Click the **purple music icon**
- Icon changes to 🔇 (crossed out)
- Music stops
- Click again to unmute

### Mute Sound Effects
- Click the **cyan speaker icon** 🔊
- Icon changes to 🔇 (crossed out)
- Button sounds stop
- Music keeps playing (independent!)
- Click again to unmute

---

## Settings Persistence

**Good news**: Your settings are saved!

- Set music to 35%, close browser, reopen → still 35%
- Mute SFX, switch to Resources, back to Missions → still muted
- Settings save automatically in localStorage

---

## Troubleshooting

### "I don't see any audio panels!"
- Check bottom-right corner
- Scroll down if needed
- Should be above the HUD/stats panel

### "Clicking music icon does nothing"
- Check browser console (F12)
- Look for errors in red
- Browser might be blocking autoplay
- Try clicking anywhere on page first

### "Test Sound button is silent"
- Check cyan volume slider - is it at 0?
- Drag it to 60%
- Check if speaker icon is crossed out
- If crossed, click to unmute
- Check system volume

### "Navigation buttons are silent"
- Same fix as Test Sound button
- Make sure cyan slider is up
- Check speaker icon not crossed out

### "Music won't start"
- Click the purple icon manually
- Yellow message "Click to start music!" will appear
- Browser needs user interaction first
- After first click, should work fine

---

## What Each Sound Sounds Like

| Action | Sound Description |
|--------|------------------|
| **Background Music** | Epic orchestral fantasy theme, loops |
| **Navigation** | Soft "swish" UI click |
| **Accept Mission** | Heroic "ding!" confirmation |
| **Test Sound** | Same as Accept Mission |

---

## Expected Behavior

### ✅ Normal:
- Click music icon → music starts immediately
- Click test sound → sound plays immediately  
- Click navigation → soft click
- Sliders respond in real-time
- Settings save automatically

### ❌ Not Normal:
- Silence when clicking any button
- Music stops when switching sections
- Settings reset after page refresh
- No audio panels visible

---

## Browser Console Check

Want to verify it's working?

1. Press **F12** (opens developer tools)
2. Click **Console** tab
3. Click **"Test Sound"** button
4. Should see:
   ```
   Playing sound: accept at volume 0.6
   Sound accept playing successfully
   ```

If you see "Failed to play" or errors → See AUDIO_TROUBLESHOOTING.md

---

## Quick Test Checklist

Run through this in 30 seconds:

- [ ] ✅ See purple panel (music)
- [ ] ✅ See cyan panel (SFX)
- [ ] ✅ See green button (test)
- [ ] ✅ Click music icon → hear music
- [ ] ✅ Click test sound → hear ding
- [ ] ✅ Click Resources → hear click
- [ ] ✅ Sliders work
- [ ] ✅ Music keeps playing when switching views

**All checked?** You're good to go! 🎉

**Some failed?** Check AUDIO_TROUBLESHOOTING.md

---

## Summary

**Music**: Purple panel, click icon, epic orchestral  
**SFX**: Cyan panel, adjust volume, test with green button  
**Navigation**: Bottom bar, soft clicks when switching  
**Missions**: Accept mission = heroic sound  
**Settings**: Auto-save, persist forever  

**That's it!** 🎵✨

---

**Enjoy your immersive audio experience!** 🚀
