import { CONFIG } from './config.js';

export class InteractionHandler {
    constructor(controls) {
        this.controls = controls;
        this.lastMouseClick = { x: 0, y: 0, time: 0 };
        this.time = 0;
    }

    handleCanvasClick() {
        if (mouseY < CONFIG.CANVAS.HEIGHT - 150) {
            this.lastMouseClick = {
                x: mouseX,
                y: mouseY,
                time: millis()
            };
        }
    }

    calculateMouseInfluence(x, y) {
        let dx = mouseX - x;
        let dy = mouseY - y;
        let distance = sqrt(dx * dx + dy * dy);
        let influence = map(distance, 0, CONFIG.INTERACTION.MOUSE_INFLUENCE_RADIUS, 1, 0, true);
        
        // Click ripple effect
        let timeSinceClick = millis() - this.lastMouseClick.time;
        if (timeSinceClick < CONFIG.INTERACTION.RIPPLE_DURATION) {
            let clickDx = this.lastMouseClick.x - x;
            let clickDy = this.lastMouseClick.y - y;
            let clickDistance = sqrt(clickDx * clickDx + clickDy * clickDy);
            let rippleRadius = timeSinceClick / CONFIG.INTERACTION.RIPPLE_SPEED;
            let rippleInfluence = map(abs(clickDistance - rippleRadius), 0, CONFIG.INTERACTION.RIPPLE_WIDTH, 1, 0, true);
            influence = max(influence, rippleInfluence);
        }
        
        return influence;
    }

    updateTime() {
        if (this.controls.animation.autoRotate.checked() || 
            this.controls.animation.waveMotion.checked() || 
            this.controls.animation.pulseSize.checked()) {
            this.time += this.controls.animation.speed.slider.value() * 0.02;
        }
    }

    calculateAnimationEffects(x, y, i) {
        let effects = {
            yOffset: 0,
            rotation: 0,
            sizeMultiplier: 1,
            mouseInfluence: 0
        };

        // Wave motion
        if (this.controls.animation.waveMotion.checked()) {
            effects.yOffset = sin(this.time + i * 0.5) * 30;
        }

        // Mouse interaction
        if ((this.controls.interaction.mouseAttract.checked() || 
             this.controls.interaction.mouseRepel.checked()) && 
            mouseY < CONFIG.CANVAS.HEIGHT - 150) {
            effects.mouseInfluence = this.calculateMouseInfluence(x, y + effects.yOffset);
            if (this.controls.interaction.mouseRepel.checked()) {
                effects.mouseInfluence *= -1;
            }
        }

        // Auto rotation
        if (this.controls.animation.autoRotate.checked()) {
            effects.rotation += this.time * 50;
        }

        // Mouse influence on rotation
        if (effects.mouseInfluence > 0) {
            effects.rotation += effects.mouseInfluence * 45 * sin(this.time * 2);
        }

        // Size pulse
        if (this.controls.animation.pulseSize.checked()) {
            effects.sizeMultiplier += sin(this.time * 2 + i * 0.3) * 0.2;
        }

        // Mouse influence on size
        if (effects.mouseInfluence > 0) {
            effects.sizeMultiplier += effects.mouseInfluence * 0.3;
        }

        return effects;
    }
} 