# 🎵 Audio Quick Reference - Cosmic Odyssey

## ⚡ Quick Implementation

### Step 1: Import the Hook
```tsx
import { useSound } from '../hooks/useSound';
```

### Step 2: Use in Component
```tsx
function MyComponent() {
  const { playSound } = useSound();
  
  return (
    <button onClick={() => {
      playSound('soundType');
      // your action
    }}>
      Click Me
    </button>
  );
}
```

---

## 🎯 Sound Types Cheat Sheet

| Action | Sound Type | Example Usage |
|--------|-----------|---------------|
| **NAVIGATION** |
| Switch panels | `'navigation'` | Galaxy → Resources |
| **MISSION ACTIONS** |
| Accept mission | `'accept'` | Accept Mission button |
| Complete mission | `'success'` | Mission Complete |
| **VOTING** |
| Vote for | `'vote-for'` | Support proposal |
| Vote against | `'vote-against'` | Oppose proposal |
| **EXPLORATION** |
| Travel | `'travel'` | Warp to planet |
| Discover | `'discover'` | Scan new planet |
| **RESOURCE MANAGEMENT** |
| Mine | `'mine'` | Extract resources |
| Buy | `'buy'` | Purchase items |
| Sell | `'sell'` | Sell items |
| **STAKING** |
| Stake | `'stake'` | Lock tokens/NFTs |
| Unstake | `'unstake'` | Unlock assets |
| **CREATION** |
| Craft/Fuse | `'craft'` | Fuse NFTs |
| Build | `'upgrade'` | Build facility |
| **COMBAT** |
| Battle | `'battle'` | Initiate attack |
| **DIPLOMACY** |
| Message | `'message'` | Send message |
| Negotiate | `'negotiate'` | Propose treaty |
| Accept alliance | `'accept'` | Join alliance |
| Break alliance | `'reject'` | Leave alliance |
| **GOVERNANCE** |
| Submit proposal | `'submit'` | Create proposal |
| **RESEARCH** |
| Research tech | `'research'` | Unlock technology |
| **NOTIFICATIONS** |
| Success | `'success'` | Action succeeded |
| Error | `'error'` | Action failed |
| Info | `'notification'` | General alert |

---

## 📋 Copy-Paste Examples

### Navigation Buttons (All Same Sound)
```tsx
// Galaxy Map button
<button onClick={() => {
  playSound('navigation');
  setView('galaxy');
}}>Galaxy Map</button>

// Resources button  
<button onClick={() => {
  playSound('navigation');
  setView('resources');
}}>Resources</button>
```

### Mission Control
```tsx
// Accept Mission
<button onClick={() => {
  playSound('accept');
  acceptMission(missionId);
}}>Accept Mission</button>

// Complete Mission
<button onClick={() => {
  playSound('success');
  completeMission(missionId);
}}>Claim Rewards</button>
```

### Governance Voting
```tsx
// Vote For
<button onClick={() => {
  playSound('vote-for');
  vote(proposalId, true);
}}>Vote For</button>

// Vote Against
<button onClick={() => {
  playSound('vote-against');
  vote(proposalId, false);
}}>Vote Against</button>

// Submit Proposal
<button onClick={() => {
  playSound('submit');
  createProposal();
}}>Submit Proposal</button>
```

### Trading
```tsx
// Buy
<button onClick={() => {
  playSound('buy');
  purchaseItem();
}}>Buy</button>

// Sell
<button onClick={() => {
  playSound('sell');
  sellItem();
}}>Sell</button>
```

### Resource Management
```tsx
// Mine
<button onClick={() => {
  playSound('mine');
  mineResources();
}}>Mine</button>

// Auto-Optimize
<button onClick={() => {
  playSound('upgrade');
  optimizeResources();
}}>Auto-Optimize</button>
```

### Diplomacy
```tsx
// Send Message
<button onClick={() => {
  playSound('message');
  sendMessage();
}}>Send Message</button>

// Propose Alliance
<button onClick={() => {
  playSound('negotiate');
  proposeAlliance();
}}>Propose Alliance</button>

// Break Alliance
<button onClick={() => {
  playSound('reject');
  breakAlliance();
}}>Break Alliance</button>
```

### Travel & Exploration
```tsx
// Travel
<button onClick={() => {
  playSound('travel');
  travelToPlanet();
}}>Travel</button>

// Discover
<button onClick={() => {
  playSound('discover');
  discoverPlanet();
}}>Discover Planet</button>
```

### Staking
```tsx
// Stake
<button onClick={() => {
  playSound('stake');
  stakeTokens();
}}>Stake</button>

// Unstake
<button onClick={() => {
  playSound('unstake');
  unstakeTokens();
}}>Unstake</button>
```

### NFT Actions
```tsx
// Fuse NFTs
<button onClick={() => {
  playSound('craft');
  fuseNFTs();
}}>Fuse NFTs</button>

// Purchase NFT
<button onClick={() => {
  playSound('buy');
  buyNFT();
}}>Purchase NFT</button>
```

### Research
```tsx
// Research Technology
<button onClick={() => {
  playSound('research');
  researchTech();
}}>Research</button>
```

### Battle
```tsx
// Initiate Battle
<button onClick={() => {
  playSound('battle');
  startBattle();
}}>Initiate Battle</button>
```

---

## 🎨 Custom Volume Example
```tsx
// Play at 80% volume
playSound('battle', 0.8);

// Play at 30% volume  
playSound('notification', 0.3);
```

---

## 🎵 Background Music Control

Music is controlled by the AudioManager component:
- **Separate volume control** from SFX
- **Loops continuously**
- **Can be muted** independently
- Settings **persist** in localStorage

---

## 🔧 Testing All Sounds

```tsx
// Test component
function SoundTester() {
  const { playSound } = useSound();
  
  const sounds = [
    'navigation', 'accept', 'reject', 'vote-for', 'vote-against',
    'travel', 'mine', 'buy', 'sell', 'stake', 'unstake',
    'craft', 'discover', 'battle', 'success', 'error',
    'notification', 'message', 'negotiate', 'upgrade',
    'research', 'submit'
  ];
  
  return (
    <div>
      {sounds.map(sound => (
        <button key={sound} onClick={() => playSound(sound as any)}>
          Test {sound}
        </button>
      ))}
    </div>
  );
}
```

---

## ✅ Implementation Checklist

- [ ] Import `useSound` hook
- [ ] Add `playSound` to button onClick
- [ ] Choose correct sound type for action
- [ ] Test sound plays correctly
- [ ] Adjust volume if needed (optional)
- [ ] Verify sound matches action feel

---

## 🎯 Best Practices

1. **Same sound for similar actions**
   - All navigation buttons: `'navigation'`
   - All accept/confirm: `'accept'`
   - All reject/cancel: `'reject'`

2. **Unique sounds for major actions**
   - Voting: Different sounds for/against
   - Trading: Different sounds buy/sell
   - Combat: Unique battle sound

3. **Volume hierarchy**
   - Navigation: 30-40% (subtle)
   - Actions: 50-70% (clear)
   - Impacts: 70-90% (prominent)

4. **Test on multiple devices**
   - Desktop speakers
   - Mobile phone
   - Headphones

---

**Now make it sound epic! 🎵✨**
