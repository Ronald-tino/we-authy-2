# Settings Page - Visual Guide

## Navigation Structure

### Before (7 Tabs)

```
👤 Account      ← REMOVED (handled by Profile)
🔒 Privacy      ← REMOVED (coming back later)
🔔 Notifications ← KEPT
🛡️ Security     ← KEPT
⚙️ Preferences  ← REMOVED (coming back later)
🚚 Delivery     ← MOVED to "Coming Soon"
💳 Payment      ← MOVED to "Coming Soon"
```

### After (4 Tabs)

```
🔔 Notifications ← Active and functional
🛡️ Security     ← Active and functional
🚚 Delivery     [Soon] ← Coming Soon placeholder
💳 Payment      [Soon] ← Coming Soon placeholder
```

## Page Layout

```
┌─────────────────────────────────────────────────────────┐
│ ═══ Settings Header ═══════════════════════════════════ │
│                                                           │
│ Settings                            [💾 Save Changes]    │
│ Manage your notifications, security, and app preferences │
│                                                           │
├──────────────┬──────────────────────────────────────────┤
│              │                                           │
│ Navigation   │  Content Area                            │
│              │                                           │
│ 🔔 Notif.    │  ┌─────────────────────────────────┐    │
│              │  │ Toggle switches for:             │    │
│ 🛡️ Security  │  │ • Email Notifications           │    │
│              │  │ • Push Notifications            │    │
│ 🚚 Delivery  │  │ • SMS Notifications             │    │
│    [Soon]    │  │ • Order Updates                 │    │
│              │  │ • Message Alerts                │    │
│ 💳 Payment   │  │ • Marketing Emails              │    │
│    [Soon]    │  └─────────────────────────────────┘    │
│              │                                           │
└──────────────┴──────────────────────────────────────────┘
```

## Coming Soon Display

When clicking on Delivery or Payment tabs:

```
┌─────────────────────────────────────────────────────────┐
│                                                           │
│                    ╭───────────────╮                     │
│                    │               │                     │
│                    │   ⏰ Icon     │  ← Animated         │
│                    │               │                     │
│                    ╰───────────────╯                     │
│                                                           │
│                  Payment & Billing                       │
│                                                           │
│   Manage your payment methods, withdrawal settings,      │
│   and billing preferences. This feature will be          │
│   available soon.                                        │
│                                                           │
│              ┌─────────────────────┐                     │
│              │  ℹ️  Coming Soon    │                     │
│              └─────────────────────┘                     │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## Mobile Layout

```
┌─────────────────────────┐
│ Settings                │
│ Manage your settings... │
│                         │
│    [💾 Save Changes]    │
├─────────────────────────┤
│ Navigation (2 columns)  │
│ ┌──────────┬──────────┐ │
│ │    🔔    │   🛡️    │ │
│ │  Notif   │ Security │ │
│ └──────────┴──────────┘ │
│ ┌──────────┬──────────┐ │
│ │    🚚    │   💳     │ │
│ │ Delivery │ Payment  │ │
│ │  [Soon]  │  [Soon]  │ │
│ └──────────┴──────────┘ │
├─────────────────────────┤
│                         │
│   Content Area          │
│   (Full Width)          │
│                         │
└─────────────────────────┘
```

## Color Scheme

### Accent Colors

- **Primary Green**: Used for save button, active toggles, badges
- **Gradient**: `linear-gradient(135deg, var(--green-bright), var(--green-medium))`

### States

- **Default**: Gray with subtle borders
- **Hover**: Lighter background, higher opacity
- **Active**: Secondary background with border
- **Coming Soon**: 70% opacity with "Soon" badge

## Animations

### Pulse Animation (Coming Soon Icon)

```
0%   → scale(1.0), opacity(0.8)
50%  → scale(1.05), opacity(1.0)
100% → scale(1.0), opacity(0.8)
Duration: 3 seconds, infinite loop
```

### Transitions

- Button hover: `0.3s ease`
- Toggle switch: `0.3s`
- Tab switching: Framer Motion animations

## Key Design Principles

1. **Minimalism**: Only essential controls visible
2. **Clarity**: Clear labels and descriptions
3. **Feedback**: Visual feedback for all interactions
4. **Accessibility**: High contrast, clear typography
5. **Consistency**: Matches Profile and other pages
6. **Modern**: Follows 2025 web design trends

## Responsive Breakpoints

- **Desktop**: ≥1024px - Sidebar + content
- **Tablet**: 768px - 1023px - Optimized spacing
- **Mobile**: <768px - Stacked layout, 2-col nav

---

This visual guide complements the technical documentation and helps understand the UI structure at a glance.



