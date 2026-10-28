# Helene's Treasure Chest

A free, family-friendly jewel-matching (match-3) game from Peter's Arcade. Play: https://ploug76.github.io/helenes-treasure-chest/

- 8x8 board: swipe or tap-tap to swap neighbours; 3+ in a row clears, cascades multiply.
- Specials: match 4 = Line Gem (row/column), L/T = Burst Gem (3x3), match 5 = Treasure Star (clears one colour). Special + special combos.
- Modes: Classic (level goals, 30 moves per level, retry any time), Zen (no game over), Treasure Rush (2 minutes).
- Hints after 6 s idle or on demand, automatic reshuffle when stuck, invalid swaps bounce back free.
- Big gems, 18px+ text, 48px+ buttons, gentle synthesized sounds with mute, progress and bests saved on the device.
- Visuals (v9, gfx.js): animated bokeh background, velvet board, glowing jewels with distinct shapes (Ruby is a heart), glow/shard bursts, coins that fly to the score, big COMBO callouts, gentle shake on big combos, a chest that opens with confetti on level clear. Effects step down automatically on slow phones (add ?lite=1 or ?q=0 to force lighter modes).
- Helene herself (v10, helene.js): a friendly cartoon of Helene holding her treasure chest is on the cover and stands beside the board, cheering on every GREAT!/COMBO and level clear (only in free space, never over the jewels; a round face badge on small screens). Her face is also on the title and Level Complete cards.
- All art is drawn in code (art.js) or by hand for this game; no third-party assets. PWA with offline service worker.
