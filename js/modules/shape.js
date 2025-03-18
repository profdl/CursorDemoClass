import { CONFIG } from './config.js';

export class ShapeRenderer {
    constructor(controls) {
        this.controls = controls;
    }

    drawShape(x, y, rotation, sizeMultiplier, color) {
        push();
        
        let currentWidth = this.controls.shape.width.slider.value() * sizeMultiplier;
        let currentHeight = this.controls.shape.height.slider.value() * sizeMultiplier;
        let points = this.controls.shape.points.slider.value();
        
        fill(color);
        translate(x, y);
        rotate(radians(rotation));
        
        switch(this.controls.shape.type.value()) {
            case 'rectangle':
                rect(0, 0, currentWidth, currentHeight);
                break;
            case 'circle':
                ellipse(0, 0, currentWidth, currentHeight);
                break;
            case 'star':
                this.drawStar(0, 0, currentWidth/2, currentHeight/2, points);
                break;
            case 'polygon':
                this.drawPolygon(0, 0, currentWidth/2, points);
                break;
            case 'diamond':
                this.drawDiamond(0, 0, currentWidth, currentHeight);
                break;
        }
        
        pop();
    }

    drawStar(x, y, radius1, radius2, points) {
        let angle = TWO_PI / points;
        let halfAngle = angle / 2.0;
        
        beginShape();
        for (let a = -PI/2; a < TWO_PI - PI/2; a += angle) {
            let sx = x + cos(a) * radius2;
            let sy = y + sin(a) * radius2;
            vertex(sx, sy);
            sx = x + cos(a + halfAngle) * radius1;
            sy = y + sin(a + halfAngle) * radius1;
            vertex(sx, sy);
        }
        endShape(CLOSE);
    }

    drawPolygon(x, y, radius, points) {
        let angle = TWO_PI / points;
        
        beginShape();
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = x + cos(a) * radius;
            let sy = y + sin(a) * radius;
            vertex(sx, sy);
        }
        endShape(CLOSE);
    }

    drawDiamond(x, y, width, height) {
        beginShape();
        vertex(x, y - height/2);
        vertex(x + width/2, y);
        vertex(x, y + height/2);
        vertex(x - width/2, y);
        endShape(CLOSE);
    }

    calculateColor(i, totalCount, mouseInfluence) {
        let percent = i / (totalCount - 1);
        let primaryColor = color(this.controls.color.primary.color());
        let secondaryColor = color(this.controls.color.secondary.color());
        let currentColor;
        
        switch(this.controls.color.palette.value()) {
            case 'monochrome':
                currentColor = lerpColor(primaryColor, color(0), percent);
                break;
            case 'complementary':
                currentColor = lerpColor(primaryColor, secondaryColor, percent);
                break;
            case 'analogous':
                let hue = hue(primaryColor);
                let analogousColor = color((hue + 30) % 360, saturation(primaryColor), brightness(primaryColor));
                currentColor = lerpColor(primaryColor, analogousColor, percent);
                break;
            case 'triadic':
                let triadicColor = color((hue(primaryColor) + 120) % 360, saturation(primaryColor), brightness(primaryColor));
                currentColor = lerpColor(primaryColor, triadicColor, percent);
                break;
            case 'rainbow':
                currentColor = color(hue(primaryColor) + (360 * percent), saturation(primaryColor), brightness(primaryColor));
                break;
            default:
                currentColor = lerpColor(primaryColor, secondaryColor, percent);
        }
        
        // Brighten color on mouse hover
        if (mouseInfluence > 0) {
            currentColor = lerpColor(currentColor, color(255), mouseInfluence * 0.5);
        }
        
        return currentColor;
    }
} 