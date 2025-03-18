import { CONFIG } from './config.js';

export class ShapeRenderer {
    constructor(controls) {
        this.controls = controls;
    }

    drawShape(x, y, rotation, sizeMultiplier, color) {
        push();
        
        let currentWidth = this.controls.shape.width.slider.value() * sizeMultiplier;
        let currentHeight = this.controls.shape.height.slider.value() * sizeMultiplier;
        
        fill(color);
        translate(x, y);
        rotate(radians(rotation));
        
        switch(this.controls.shape.selector.value()) {
            case 'Rectangle':
                rect(0, 0, currentWidth, currentHeight);
                break;
            case 'Circle':
                ellipse(0, 0, currentWidth, currentHeight);
                break;
            case 'Triangle':
                triangle(0, -currentHeight/2, 
                        currentWidth/2, currentHeight/2, 
                        -currentWidth/2, currentHeight/2);
                break;
        }
        
        pop();
    }

    calculateColor(i, totalCount, mouseInfluence) {
        let percent = i / (totalCount - 1);
        let c1 = color(this.controls.shape.color1.color());
        let c2 = color(this.controls.shape.color2.color());
        let currentColor = lerpColor(c1, c2, percent);
        
        // Brighten color on mouse hover
        if (mouseInfluence > 0) {
            currentColor = lerpColor(currentColor, color(255), mouseInfluence * 0.5);
        }
        
        return currentColor;
    }
} 