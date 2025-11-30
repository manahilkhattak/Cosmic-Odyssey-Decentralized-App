# 🔊 Sound Effects Guide - Cosmic Odyssey

## 🎵 Background Music

**Epic Space-Themed Orchestral Music**
- Plays continuously in a loop
- Volume controlled independently from SFX
- Adapts to different game views (optional)
- Can be muted without affecting sound effects

### Recommended Tracks
Replace the placeholder URLs in `/components/AudioManager.tsx` with:

1. **Main Theme**: Epic orchestral space opera
   - Suggested: "Space Odyssey" by audionautix.com
   - Or: "Heroic Demise" by Kevin MacLeod
   
2. **Galaxy View**: Ambient exploration music
   - Suggested: "Deep Space" by audionautix.com
   
3. **Battle/Missions**: Intense action music
   - Suggested: "Clash Defiant" by Kevin MacLeod

## 🎮 Sound Effect Categories

### 1. Navigation Sounds (Same Sound)
**Sound Type**: `navigation`  
**Character**: Soft, elegant swish/transition

**Used For:**
- Switching between Galaxy Map → Resources
- Resources → Governance
- Governance → NFT Gallery
- NFT Gallery → Diplomacy
- Diplomacy → Missions
- Any panel/section navigation

**Usage:**
```tsx
import { useSound } from '../hooks/useSound';

const { playSound } = useSound();
<button onClick={() => {
  playSound('navigation');
  setCurrentView('resources');
}}>
  Resources
</button>
```

---

### 2. Accept/Confirm Actions
**Sound Type**: `accept`  
**Character**: Positive confirmation chime

**Used For:**
- Accept Mission
- Join Alliance
- Confirm Transaction
- Accept Proposal
- Approve Action

**Usage:**
```tsx
<button onClick={() => {
  playSound('accept');
  handleAcceptMission();
}}>
  Accept Mission
</button>
```

---

### 3. Reject/Cancel Actions
**Sound Type**: `reject`  
**Character**: Negative beep/decline

**Used For:**
- Reject Mission
- Break Alliance
- Cancel Action
- Decline Proposal

**Usage:**
```tsx
<button onClick={() => {
  playSound('reject');
  handleBreakAlliance();
}}>
  Break Alliance
</button>
```

---

### 4. Vote For
**Sound Type**: `vote-for`  
**Character**: Affirmative chime

**Used For:**
- Vote For Proposal
- Support Motion
- Approve Governance Decision

**Usage:**
```tsx
<button onClick={() => {
  playSound('vote-for');
  handleVote(true);
}}>
  Vote For
</button>
```

---

### 5. Vote Against
**Sound Type**: `vote-against`  
**Character**: Negative tone

**Used For:**
- Vote Against Proposal
- Oppose Motion
- Reject Governance Decision

**Usage:**
```tsx
<button onClick={() => {
  playSound('vote-against');
  handleVote(false);
}}>
  Vote Against
</button>
```

---

### 6. Travel/Warp
**Sound Type**: `travel`  
**Character**: Whoosh, warp sound

**Used For:**
- Travel to Planet
- Wormhole Jump
- Spaceship Movement
- Teleportation

**Usage:**
```tsx
<button onClick={() => {
  playSound('travel');
  handleTravel();
}}>
  Travel
</button>
```

---

### 7. Mining
**Sound Type**: `mine`  
**Character**: Drilling, extraction

**Used For:**
- Mine Resources
- Extract Materials
- Harvest Energy
- Claim Territory Resources

**Usage:**
```tsx
<button onClick={() => {
  playSound('mine');
  handleMine();
}}>
  Mine
</button>
```

---

### 8. Buy/Purchase
**Sound Type**: `buy`  
**Character**: Cash register, purchase chime

**Used For:**
- Buy NFT
- Purchase Resources
- Acquire Items
- Market Buy Order

**Usage:**
```tsx
<button onClick={() => {
  playSound('buy');
  handlePurchase();
}}>
  Buy
</button>
```

---

### 9. Sell
**Sound Type**: `sell`  
**Character**: Transaction complete tone

**Used For:**
- Sell NFT
- Sell Resources
- Market Sell Order
- Trade Items

**Usage:**
```tsx
<button onClick={() => {
  playSound('sell');
  handleSell();
}}>
  Sell
</button>
```

---

### 10. Stake/Lock
**Sound Type**: `stake`  
**Character**: Lock, secure sound

**Used For:**
- Stake Tokens
- Stake NFT
- Lock Assets
- Secure Resources

**Usage:**
```tsx
<button onClick={() => {
  playSound('stake');
  handleStake();
}}>
  Stake
</button>
```

---

### 11. Unstake/Unlock
**Sound Type**: `unstake`  
**Character**: Unlock, release

**Used For:**
- Unstake Tokens
- Unstake NFT
- Unlock Assets
- Withdraw

**Usage:**
```tsx
<button onClick={() => {
  playSound('unstake');
  handleUnstake();
}}>
  Unstake
</button>
```

---

### 12. Craft/Create
**Sound Type**: `craft`  
**Character**: Creation, synthesis sound

**Used For:**
- Fuse NFTs
- Create Item
- Build Facility
- Craft Equipment

**Usage:**
```tsx
<button onClick={() => {
  playSound('craft');
  handleFusion();
}}>
  Fuse NFTs
</button>
```

---

### 13. Discover
**Sound Type**: `discover`  
**Character**: Discovery chime, revelation

**Used For:**
- Discover Planet
- Scan System
- Reveal Hidden Item
- Exploration Success

**Usage:**
```tsx
<button onClick={() => {
  playSound('discover');
  handleDiscover();
}}>
  Discover Planet
</button>
```

---

### 14. Battle
**Sound Type**: `battle`  
**Character**: War drums, combat initiation

**Used For:**
- Initiate Battle
- Attack Territory
- Start Combat
- Declare War

**Usage:**
```tsx
<button onClick={() => {
  playSound('battle');
  handleBattle();
}}>
  Initiate Battle
</button>
```

---

### 15. Submit/Propose
**Sound Type**: `submit`  
**Character**: Confirmation, submission

**Used For:**
- Submit Proposal
- Create Proposal
- Send Form
- Confirm Submission

**Usage:**
```tsx
<button onClick={() => {
  playSound('submit');
  handleCreateProposal();
}}>
  Submit Proposal
</button>
```

---

### 16. Message
**Sound Type**: `message`  
**Character**: Send message ping

**Used For:**
- Send Message
- Contact Alliance
- Diplomatic Communication

**Usage:**
```tsx
<button onClick={() => {
  playSound('message');
  handleSendMessage();
}}>
  Send Message
</button>
```

---

### 17. Negotiate
**Sound Type**: `negotiate`  
**Character**: Diplomatic tone

**Used For:**
- Propose Alliance
- Negotiate Treaty
- Diplomatic Action
- Trade Negotiation

**Usage:**
```tsx
<button onClick={() => {
  playSound('negotiate');
  handleNegotiate();
}}>
  Negotiate
</button>
```

---

### 18. Upgrade
**Sound Type**: `upgrade`  
**Character**: Level up, enhancement

**Used For:**
- Upgrade Facility
- Level Up NFT
- Enhance Building
- Auto-Optimize

**Usage:**
```tsx
<button onClick={() => {
  playSound('upgrade');
  handleUpgrade();
}}>
  Auto-Optimize
</button>
```

---

### 19. Research
**Sound Type**: `research`  
**Character**: Tech unlock, discovery

**Used For:**
- Research Technology
- Unlock Tech Tree
- Scientific Discovery
- Innovation

**Usage:**
```tsx
<button onClick={() => {
  playSound('research');
  handleResearch();
}}>
  Research
</button>
```

---

### 20. Success
**Sound Type**: `success`  
**Character**: Victory fanfare

**Used For:**
- Mission Complete
- Achievement Unlocked
- Success Notification
- Victory

---

### 21. Error
**Sound Type**: `error`  
**Character**: Alert, warning

**Used For:**
- Transaction Failed
- Insufficient Funds
- Error Message
- Warning Alert

---

### 22. Notification
**Sound Type**: `notification`  
**Character**: Gentle ping

**Used For:**
- General Notifications
- Info Messages
- Updates
- Alerts

---

## 🎯 Implementation Examples

### Example 1: Navigation Button
```tsx
import { useSound } from '../hooks/useSound';

function NavigationButton() {
  const { playSound } = useSound();
  
  return (
    <button onClick={() => {
      playSound('navigation');
      setCurrentView('galaxy');
    }}>
      Galaxy Map
    </button>
  );
}
```

### Example 2: Mission Accept Button
```tsx
function MissionCard({ mission }) {
  const { playSound } = useSound();
  
  return (
    <button onClick={() => {
      playSound('accept');
      acceptMission(mission.id);
    }}>
      Accept Mission
    </button>
  );
}
```

### Example 3: Trading Buttons
```tsx
function TradePanel() {
  const { playSound } = useSound();
  
  return (
    <>
      <button onClick={() => {
        playSound('buy');
        handleBuy();
      }}>
        Buy
      </button>
      
      <button onClick={() => {
        playSound('sell');
        handleSell();
      }}>
        Sell
      </button>
    </>
  );
}
```

### Example 4: Governance Voting
```tsx
function ProposalCard({ proposal }) {
  const { playSound } = useSound();
  
  return (
    <>
      <button onClick={() => {
        playSound('vote-for');
        vote(proposal.id, true);
      }}>
        Vote For
      </button>
      
      <button onClick={() => {
        playSound('vote-against');
        vote(proposal.id, false);
      }}>
        Vote Against
      </button>
    </>
  );
}
```

### Example 5: Using Sound Button Hook
```tsx
import { useSoundButton } from '../hooks/useSound';

function UpgradeButton() {
  const handleUpgradeWithSound = useSoundButton('upgrade', 0.7);
  
  return (
    <button onClick={() => handleUpgradeWithSound(upgradeBuilding)}>
      Upgrade Building
    </button>
  );
}
```

---

## 🔧 Customizing Sounds

### Replacing Sound Files

1. **Find Your Sound Effects**
   - FreeSoundEffects: https://freesound.org
   - Mixkit: https://mixkit.co/free-sound-effects/
   - Zapsplat: https://www.zapsplat.com

2. **Host Your Files**
   - Use a CDN service
   - Host on your own server
   - Use cloud storage (AWS S3, Cloudflare R2)

3. **Update Sound URLs**
   Edit `/hooks/useSound.tsx`:
   ```tsx
   const SOUND_EFFECTS: Record<SoundType, string> = {
     navigation: 'YOUR_URL_HERE.mp3',
     accept: 'YOUR_URL_HERE.mp3',
     // ... etc
   };
   ```

### Volume Control

Global volume is controlled by:
- Music Volume: 0-100% (separate control)
- SFX Volume: 0-100% (affects all sound effects)
- Individual sound can override: `playSound('battle', 0.8)` // 80% volume

### Muting

- Music and SFX can be muted independently
- Settings persist in localStorage
- Mute states: `cosmic-music-muted`, `cosmic-sfx-muted`

---

## 🎨 Sound Design Recommendations

### Navigation Sounds
- **Duration**: 100-300ms
- **Volume**: Soft (20-40%)
- **Character**: Smooth, non-intrusive

### Action Sounds
- **Duration**: 200-500ms
- **Volume**: Medium (40-70%)
- **Character**: Clear, distinctive

### Impact Sounds (Battle, Mine)
- **Duration**: 300-800ms
- **Volume**: Loud (60-90%)
- **Character**: Powerful, impactful

### Feedback Sounds (Success, Error)
- **Duration**: 500-1500ms
- **Volume**: Medium-Loud (50-80%)
- **Character**: Clear emotional tone

---

## 📦 Recommended Sound Packs

### Free Resources
1. **Sci-Fi UI Sounds**: https://mixkit.co/free-sound-effects/sci-fi/
2. **Game UI Pack**: https://freesound.org/people/LittleRobotSoundFactory/
3. **Space Ambience**: https://www.zapsplat.com/sound-effect-category/space/

### Premium Resources
1. **Epic Stock Media** - Space UI Pack
2. **Audio Jungle** - Sci-Fi Interface Sounds
3. **Sound Effects+** - Cosmic Collection

---

## 🚀 Performance Tips

1. **Preload Critical Sounds**
   ```tsx
   useEffect(() => {
     // Preload navigation sound
     new Audio(SOUND_EFFECTS.navigation).load();
   }, []);
   ```

2. **Use Audio Sprites**
   - Combine multiple sounds into one file
   - Use timing to play specific segments
   - Reduces HTTP requests

3. **Lazy Load Music**
   - Music loads when user first interacts
   - Prevents autoplay issues
   - Saves bandwidth

---

## ✅ Implementation Checklist

- [ ] Replace background music URL with epic space theme
- [ ] Test all 22 sound effect types
- [ ] Adjust volumes for each sound category
- [ ] Implement sounds in all components
- [ ] Test mute/unmute functionality
- [ ] Verify localStorage persistence
- [ ] Mobile browser compatibility check
- [ ] Add preloading for frequently used sounds

---

**Audio makes the experience! 🎵✨**
