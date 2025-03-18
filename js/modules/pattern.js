import { CONFIG } from './config.js';

export class PatternCalculator {
    constructor(controls) {
        this.controls = controls;
    }

    calculatePosition(i, pattern) {
        let x = 0, y = 200;
        const spacing = this.controls.pattern.spacing.slider.value();
        const rows = this.controls.pattern.rows.slider.value();
        const cols = this.controls.pattern.cols.slider.value();
        const baseRotation = this.controls.pattern.rotationOffset.slider.value();
        let rotation = baseRotation + (this.controls.pattern.rotation.slider.value() * i);
        
        switch(pattern) {
            case 'Linear':
                x = i * spacing;
                break;
                
            case 'Grid':
                const row = floor(i / cols);
                const col = i % cols;
                x = col * spacing - (cols * spacing) / 2 + CONFIG.CANVAS.WIDTH/2;
                y = row * spacing - (rows * spacing) / 2 + CONFIG.CANVAS.HEIGHT/2;
                break;
                
            case 'Circular':
                const totalCount = rows * cols;
                const baseRadius = this.controls.pattern.radius.slider.value();
                const radius = baseRadius + (spacing * 0.5);
                const angle = (i * TWO_PI) / totalCount;
                x = CONFIG.CANVAS.WIDTH/2 + cos(angle) * radius;
                y = CONFIG.CANVAS.HEIGHT/2 + sin(angle) * radius;
                rotation = baseRotation + angle * (180/PI) + this.controls.pattern.rotation.slider.value() * i;
                break;
        }
        
        return { x, y, rotation };
    }

    getTotalCount() {
        const rows = this.controls.pattern.rows.slider.value();
        const cols = this.controls.pattern.cols.slider.value();
        
        switch(this.controls.pattern.selector.value()) {
            case 'Linear':
                return cols;
            case 'Grid':
            case 'Circular':
                return rows * cols;
            default:
                return 0;
        }
    }
} 