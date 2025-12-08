import { drawCharacter } from './character-renderer.js';

export const HUD = {
    ringCanvas: null,
    portraitCanvas: null,

    init() {
        this.ringCanvas = document.getElementById('hud-ring-layer');
        this.portraitCanvas = document.getElementById('hud-portrait-layer');
    },

    render(player) {
        if (!this.ringCanvas || !this.portraitCanvas) return;

        // 1. Render Portrait (Only if player exists)
        const pCtx = this.portraitCanvas.getContext('2d');
        pCtx.clearRect(0, 0, this.portraitCanvas.width, this.portraitCanvas.height);

        // Clone player for "Passport Photo" look
        const portraitPlayer = {
            ...player,
            x: 0,
            y: 0,
            facing: 'down', // Front facing
            aimAngle: Math.PI / 2, // Gun down (Default position)
            isMoving: false, // Static pose (idle anim still runs in drawCharacter)
            hitAnim: null,
            username: null,   // Hide name tag in HUD portrait
            canTalk: false    // Hide interaction indicator in HUD portrait
        };

        // Center in 70x70 canvas
        // Scale 50px size
        const pSize = 45; // ~10% smaller
        const pX = (this.portraitCanvas.width - pSize) / 2;
        const pY = (this.portraitCanvas.height - pSize) / 2 + 8; // move character further down

        drawCharacter(pCtx, portraitPlayer, pX, pY, pSize, false, false);

        // 2. Render Health Ring
        const rCtx = this.ringCanvas.getContext('2d');
        const w = this.ringCanvas.width;
        const h = this.ringCanvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const radius = (w / 2) - 5;

        rCtx.clearRect(0, 0, w, h);

        const hp = player.hp || 40;
        const maxHpPerRing = 160;

        const prestige = Math.floor(hp / maxHpPerRing);
        const ringProgress = (hp % maxHpPerRing) / maxHpPerRing;

        // Color Palette for Prestige Levels
        const colors = [
             '#e74c3c', // 0: Red (Base)
             '#2ecc71', // 1: Green
             '#3498db', // 2: Blue
             '#9b59b6', // 3: Purple
             '#f1c40f', // 4: Gold
             '#1abc9c'  // 5: Teal
        ];

        const getCol = (i) => colors[i % colors.length];

        const baseColor = prestige > 0 ? getCol(prestige - 1) : 'rgba(0,0,0,0.5)';
        const activeColor = getCol(prestige);

        // Background Ring (Previous Tier)
        rCtx.beginPath();
        rCtx.arc(cx, cy, radius, 0, Math.PI * 2);
        rCtx.lineWidth = 6;
        rCtx.strokeStyle = baseColor;
        rCtx.stroke();

        // Active Progress Ring
        if (ringProgress > 0 || prestige === 0) {
            const startAngle = -Math.PI / 2;
            const endAngle = startAngle + (Math.PI * 2 * ringProgress);

            if (ringProgress > 0) {
                rCtx.beginPath();
                rCtx.arc(cx, cy, radius, startAngle, endAngle);
                rCtx.lineWidth = 6;
                rCtx.strokeStyle = activeColor;
                rCtx.lineCap = 'round';
                rCtx.stroke();
            }
        }

        // Dividers (16 slots)
        rCtx.strokeStyle = 'rgba(0,0,0,0.8)';
        rCtx.lineWidth = 2;
        for (let i = 0; i < 16; i++) {
            const angle = -Math.PI / 2 + (Math.PI * 2 * (i / 16));
            const x1 = cx + Math.cos(angle) * (radius - 4);
            const y1 = cy + Math.sin(angle) * (radius - 4);
            const x2 = cx + Math.cos(angle) * (radius + 4);
            const y2 = cy + Math.sin(angle) * (radius + 4);

            rCtx.beginPath();
            rCtx.moveTo(x1, y1);
            rCtx.lineTo(x2, y2);
            rCtx.stroke();
        }
    }
};