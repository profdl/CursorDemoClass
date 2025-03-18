import { CONFIG } from './config.js';

export class UIController {
    constructor() {
        this.controls = {
            pattern: {},
            shape: {},
            animation: {},
            interaction: {}
        };
    }

    createSliderWithLabel(label, config, parent) {
        const container = createDiv();
        container.parent(parent);
        
        const labelElem = createSpan(label);
        labelElem.style('font-size', '14px');
        labelElem.style('color', '#333');
        labelElem.parent(container);
        
        const slider = createSlider(config.min, config.max, config.default, config.step);
        slider.style('width', '100%');
        slider.parent(container);
        
        const valueLabel = createSpan();
        valueLabel.class('label');
        valueLabel.parent(container);
        
        return { slider, valueLabel };
    }

    setupPatternControls() {
        const patternControls = select('#pattern-controls');
        
        // Pattern selector
        this.controls.pattern.selector = createSelect();
        this.controls.pattern.selector.parent(patternControls);
        this.controls.pattern.selector.option('Linear');
        this.controls.pattern.selector.option('Grid');
        this.controls.pattern.selector.option('Circular');
        this.controls.pattern.selector.style('margin-bottom', '12px');
        
        // Pattern sliders
        const patternConfig = CONFIG.CONTROLS.PATTERN;
        this.controls.pattern.spacing = this.createSliderWithLabel('Spacing', patternConfig.SPACING, patternControls);
        this.controls.pattern.rotation = this.createSliderWithLabel('Rotation Step', patternConfig.ROTATION, patternControls);
        this.controls.pattern.rotationOffset = this.createSliderWithLabel('Rotation Offset', patternConfig.ROTATION_OFFSET, patternControls);
        this.controls.pattern.rows = this.createSliderWithLabel('Rows', patternConfig.ROWS, patternControls);
        this.controls.pattern.cols = this.createSliderWithLabel('Columns', patternConfig.COLS, patternControls);
        this.controls.pattern.radius = this.createSliderWithLabel('Radius', patternConfig.RADIUS, patternControls);
    }

    setupShapeControls() {
        const shapeControls = select('#shape-controls');
        const shapeConfig = CONFIG.CONTROLS.SHAPE;
        
        // Shape sliders
        this.controls.shape.height = this.createSliderWithLabel('Height', shapeConfig.HEIGHT, shapeControls);
        this.controls.shape.width = this.createSliderWithLabel('Width', shapeConfig.WIDTH, shapeControls);
        
        // Color pickers
        const colorDiv = createDiv();
        colorDiv.parent(shapeControls);
        colorDiv.class('color-pickers');
        
        this.controls.shape.color1 = createColorPicker('#000000');
        this.controls.shape.color2 = createColorPicker('#ff0000');
        this.controls.shape.color1.parent(colorDiv);
        this.controls.shape.color2.parent(colorDiv);
        
        // Shape selector
        this.controls.shape.selector = createSelect();
        this.controls.shape.selector.parent(shapeControls);
        this.controls.shape.selector.option('Rectangle');
        this.controls.shape.selector.option('Circle');
        this.controls.shape.selector.option('Triangle');
    }

    setupAnimationControls() {
        const animationControls = select('#animation-controls');
        const animationConfig = CONFIG.CONTROLS.ANIMATION;
        
        // Speed slider
        this.controls.animation.speed = this.createSliderWithLabel('Speed', animationConfig.SPEED, animationControls);
        
        // Checkboxes
        const checkboxGroup = createDiv();
        checkboxGroup.class('checkbox-group');
        checkboxGroup.parent(animationControls);
        
        this.controls.animation.autoRotate = createCheckbox('Auto Rotate', false);
        this.controls.animation.waveMotion = createCheckbox('Wave Motion', false);
        this.controls.animation.pulseSize = createCheckbox('Pulse Size', false);
        
        [this.controls.animation.autoRotate, 
         this.controls.animation.waveMotion, 
         this.controls.animation.pulseSize].forEach(checkbox => checkbox.parent(checkboxGroup));
    }

    setupInteractionControls() {
        const interactionControls = select('#interaction-controls');
        
        const checkboxGroup = createDiv();
        checkboxGroup.class('checkbox-group');
        checkboxGroup.parent(interactionControls);
        
        this.controls.interaction.mouseAttract = createCheckbox('Mouse Attract', false);
        this.controls.interaction.mouseRepel = createCheckbox('Mouse Repel', false);
        
        [this.controls.interaction.mouseAttract, 
         this.controls.interaction.mouseRepel].forEach(checkbox => checkbox.parent(checkboxGroup));
        
        // Save button
        this.controls.interaction.saveButton = createButton('Save Image');
        this.controls.interaction.saveButton.parent(interactionControls);
    }

    setup() {
        this.setupPatternControls();
        this.setupShapeControls();
        this.setupAnimationControls();
        this.setupInteractionControls();
        return this.controls;
    }

    updateLabels() {
        // Update all slider labels
        Object.entries(this.controls).forEach(([category, controls]) => {
            Object.entries(controls).forEach(([name, control]) => {
                if (control.valueLabel) {
                    const value = control.slider.value();
                    control.valueLabel.html(`${name}: ${value}`);
                }
            });
        });
    }
} 