# 🔧 Audio Troubleshooting Guide

## Quick Test Checklist

### 1. Test Background Music
1. Look for the **purple music control** panel (bottom-right corner)
2. Click the **music icon** (purple note/speaker)
3. You should hear epic orchestral music start playing
4. Icon should **pulse** when playing
5. Try adjusting the volume slider

**Expected**: Music starts immediately and loops

### 2. Test Sound Effects
1. Look for the **cyan SFX control** panel (below music panel)
2. Click the green **"🎵 Test Sound"** button
3. You should hear a heroic confirmation sound
4. Try adjusting the SFX volume slider
5. Click test button again

**Expected**: Clear sound effect each time you click

### 3. Test Navigation Sounds
1. Click on **RESOURCES** in the bottom navigation bar
2. You should hear a soft UI click sound
3. Click on **GOVERNANCE**
4. Another soft click sound
5. Try all navigation buttons

**Expected**: Same soft click for all navigation buttons

### 4. Test Mission Sounds
1. Go to **MISSIONS** section
2. Scroll to an available mission
3. Click **"Accept Mission"**
4. You should hear a heroic confirmation sound

**Expected**: Heroic sound when accepting missions

---

## Common Issues & Solutions

### ❌ Issue: No Sound At All

**Possible Causes:**
1. Browser tab is muted
2. System volume is muted/low
3. Browser blocked autoplay
4. Audio URLs not loading

**Solutions:**
✅ Check browser tab - look for 🔇 icon and unmute
✅ Check system volume - increase to 50%+
✅ Click the music icon to manually start audio
✅ Check browser console (F12) for errors
✅ Try clicking "Test Sound" button multiple times

### ❌ Issue: Music Doesn't Start

**Possible Causes:**
1. Browser autoplay policy
2. Music volume at 0%
3. Music muted

**Solutions:**
✅ **Click the purple music icon** to start manually
✅ Drag the purple volume slider to 30-50%
✅ Look for yellow "Click to start music!" message
✅ If icon is gray/crossed out, click it to unmute

### ❌ Issue: Button Sounds Don't Play

**Possible Causes:**
1. SFX muted
2. SFX volume at 0%
3. Console errors

**Solutions:**
✅ Check cyan SFX panel - icon should be speaker (not X)
✅ Drag cyan volume slider to 50%+
✅ Click "Test Sound" button - should play immediately
✅ Open browser console (F12) - check for errors
✅ Look for console logs saying "Playing sound: accept at volume X"

### ❌ Issue: Sounds Play But Very Quiet

**Solutions:**
✅ Music: Increase purple slider to 50%+
✅ SFX: Increase cyan slider to 60%+
✅ Check system volume
✅ Check browser tab volume

### ❌ Issue: Music Stops When Switching Sections

**Expected Behavior**: Music should keep playing!

**If it stops:**
✅ Check browser console for errors
✅ Make sure music icon still shows pulsing
✅ Click music icon to restart

### ❌ Issue: Settings Don't Persist

**Solutions:**
✅ Check if localStorage is enabled
✅ Not in incognito/private mode?
✅ Clear localStorage and try again:
   - Open console (F12)
   - Type: `localStorage.clear()`
   - Refresh page
   - Set volumes again

---

## Debug Mode

### Enable Console Logging

Open browser console (F12) and look for these messages:

**When clicking Test Sound:**
```
Playing sound: accept at volume 0.6
Sound accept playing successfully
```

**When clicking navigation:**
```
Playing sound: navigation at volume 0.6
Sound navigation playing successfully
```

**If you see errors:**
```
Failed to play sound: [error details]
```
→ Copy error and check "Error Solutions" below

---

## Error Solutions

### "Failed to play sound: NotAllowedError"
**Cause**: Browser blocking autoplay
**Solution**: Click anywhere on the page first, then try sounds

### "Audio loading error"
**Cause**: Sound URL not accessible
**Solution**: Check internet connection, URLs may be blocked

### "SFX muted, skipping sound"
**Cause**: SFX is muted via toggle
**Solution**: Click cyan speaker icon to unmute

### Network errors
**Cause**: Sound files not loading
**Solution**: 
- Check internet connection
- Try different browser
- Check if firewall blocks Mixkit CDN

---

## Manual Testing Steps

### Full Audio System Test:

1. **Open app** - Look for purple & cyan panels bottom-right

2. **Test Music**:
   - Click purple music icon
   - Should start immediately
   - Icon should pulse
   - Label changes to "Music Playing"

3. **Test SFX Volume**:
   - Cyan slider at 60%
   - Click "Test Sound" button
   - Should hear clear sound

4. **Test Navigation**:
   - Click "RESOURCES" - soft click
   - Click "GOVERNANCE" - soft click
   - Click "MISSIONS" - soft click

5. **Test Mission Accept**:
   - Go to MISSIONS
   - Click "Accept Mission"
   - Heroic sound plays

6. **Test Persistence**:
   - Set music to 40%
   - Set SFX to 70%
   - Click RESOURCES
   - Click MISSIONS
   - Volumes should stay the same

7. **Test After Refresh**:
   - Set volumes to specific numbers
   - Refresh page (F5)
   - Volumes should load at same numbers

---

## Browser Compatibility

### ✅ Tested & Working:
- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+

### ⚠️ Known Issues:
- **Safari**: May require user interaction before audio plays
- **Mobile Firefox**: Autoplay sometimes blocked
- **Incognito Mode**: Settings won't persist

---

## Advanced Debugging

### Check Audio Elements

Open console and run:
```javascript
// Check if audio manager loaded
document.querySelector('[class*="fixed bottom-24"]')

// Check localStorage
console.log('Music Volume:', localStorage.getItem('cosmic-music-volume'))
console.log('SFX Volume:', localStorage.getItem('cosmic-sfx-volume'))
console.log('Music Muted:', localStorage.getItem('cosmic-music-muted'))
console.log('SFX Muted:', localStorage.getItem('cosmic-sfx-muted'))
```

### Reset All Audio Settings
```javascript
localStorage.removeItem('cosmic-music-volume')
localStorage.removeItem('cosmic-music-muted')
localStorage.removeItem('cosmic-sfx-volume')
localStorage.removeItem('cosmic-sfx-muted')
location.reload()
```

---

## What You Should See/Hear

### Music Panel (Purple):
- 🎵 Icon (pulsing when playing)
- "Music Playing" or "Background Music"
- Volume slider (0-100%)
- Volume number display

### SFX Panel (Cyan):
- 🔊 Speaker icon
- "Sound Effects"
- Volume slider (0-100%)
- Volume number display

### Test Button (Green):
- "🎵 Test Sound"
- Plays immediately when clicked
- No delay

### Navigation:
- Soft "swish" sound
- Same for all 7 buttons
- Instant feedback

---

## Still Not Working?

### Last Resort Fixes:

1. **Hard Refresh**:
   - Windows/Linux: Ctrl + Shift + R
   - Mac: Cmd + Shift + R

2. **Clear Cache**:
   - Chrome: Settings → Privacy → Clear browsing data
   - Select "Cached images and files"

3. **Try Different Browser**:
   - Test in Chrome if using Firefox
   - Test in Edge if using Safari

4. **Check URLs Manually**:
   - Open this in new tab: `https://assets.mixkit.co/active_storage/sfx/2995/2995.wav`
   - Should download/play music
   - If doesn't work: Network/firewall issue

5. **Console Logging**:
   - All sound plays should log to console
   - If no logs appear: Hook not loading
   - Check for React errors

---

## Quick Verification

**✅ Audio Working If:**
- [ ] Purple music panel visible
- [ ] Cyan SFX panel visible  
- [ ] Green test button visible
- [ ] Clicking test button = sound
- [ ] Clicking music icon = music
- [ ] Clicking navigation = soft click
- [ ] Sliders change volume in real-time
- [ ] Settings persist across sections

**❌ Audio Broken If:**
- [ ] No panels visible
- [ ] Clicking test button = silence
- [ ] Console shows errors
- [ ] Music icon doesn't pulse
- [ ] Navigation clicks = silence

---

**Need More Help?**
Check browser console (F12) and look for error messages.
All sound plays should log to console with "Playing sound: [type]"
