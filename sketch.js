import { CONFIG } from './js/modules/config.js';
import { UIController } from './js/modules/ui.js';
import { PatternCalculator } from './js/modules/pattern.js';
import { InteractionHandler } from './js/modules/interaction.js';
import { ShapeRenderer } from './js/modules/shape.js';

let uiController;
let patternCalculator;
let interactionHandler;
let shapeRenderer;

window.setup = function() {
    // Create canvas and add it to the canvas container
    const canvas = createCanvas(CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);
    canvas.parent('canvas-container');
    canvas.mouseClicked(() => interactionHandler.handleCanvasClick());
    
    // Initialize controllers
    uiController = new UIController();
    const controls = uiController.setup();
    
    patternCalculator = new PatternCalculator(controls);
    interactionHandler = new InteractionHandler(controls);
    shapeRenderer = new ShapeRenderer(controls);
    
    // Setup save button callback
    controls.interaction.saveButton.mousePressed(() => saveCanvas(canvas, 'my_pattern', 'png'));
}

window.draw = function() {
    background(...CONFIG.CANVAS.BACKGROUND);
    
    // Update UI labels
    uiController.updateLabels();
    
    // Update animation time
    interactionHandler.updateTime();
    
    // Get total count of shapes to draw
    const totalCount = patternCalculator.getTotalCount();
    
    // Draw shapes
    for(let i = 0; i < totalCount; i++) {
        // Get base position
        const pos = patternCalculator.calculatePosition(i, uiController.controls.pattern.selector.value());
        
        // Calculate animation and interaction effects
        const effects = interactionHandler.calculateAnimationEffects(pos.x, pos.y, i);
        
        // Apply mouse influence to position
        let finalX = pos.x;
        let finalY = pos.y + effects.yOffset;
        if (effects.mouseInfluence > 0) {
            finalX += effects.mouseInfluence * (mouseX - finalX) * 0.2;
            finalY += effects.mouseInfluence * (mouseY - finalY) * 0.2;
        }
        
        // Calculate final rotation
        const finalRotation = pos.rotation + effects.rotation;
        
        // Calculate color
        const color = shapeRenderer.calculateColor(i, totalCount, effects.mouseInfluence);
        
        // Draw the shape
        shapeRenderer.drawShape(finalX, finalY, finalRotation, effects.sizeMultiplier, color);
    }
} 