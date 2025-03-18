import { CONFIG } from './config.js';

export class UIController {
    constructor() {
        this.controls = {
            pattern: {},
            shape: {},
            animation: {},
            interaction: {},
            color: {}
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
        
        // Shape type selector
        this.controls.shape.type = createSelect();
        this.controls.shape.type.parent(shapeControls);
        shapeConfig.TYPE.options.forEach(option => {
            this.controls.shape.type.option(option);
        });
        this.controls.shape.type.value(shapeConfig.TYPE.default);
        this.controls.shape.type.style('margin-bottom', '12px');
        
        // Shape sliders
        this.controls.shape.height = this.createSliderWithLabel('Height', shapeConfig.HEIGHT, shapeControls);
        this.controls.shape.width = this.createSliderWithLabel('Width', shapeConfig.WIDTH, shapeControls);
        this.controls.shape.points = this.createSliderWithLabel('Points', shapeConfig.POINTS, shapeControls);
        
        // Show/hide points slider based on shape type
        this.controls.shape.type.changed(() => {
            const type = this.controls.shape.type.value();
            this.controls.shape.points.slider.style('display', 
                ['star', 'polygon'].includes(type) ? 'block' : 'none');
        });
    }

    setupColorControls() {
        const colorControls = createDiv();
        colorControls.parent(select('#controls'));
        colorControls.class('control-group');
        
        const title = createElement('h3');
        title.html('Color');
        title.parent(colorControls);
        
        // Color palette selector
        this.controls.color.palette = createSelect();
        this.controls.color.palette.parent(colorControls);
        CONFIG.CONTROLS.COLOR.PALETTES.options.forEach(option => {
            this.controls.color.palette.option(option);
        });
        this.controls.color.palette.value(CONFIG.CONTROLS.COLOR.PALETTES.default);
        this.controls.color.palette.style('margin-bottom', '12px');
        
        // Color pickers
        const colorPickers = createDiv();
        colorPickers.class('color-pickers');
        colorPickers.parent(colorControls);
        
        this.controls.color.primary = createColorPicker(CONFIG.CONTROLS.COLOR.PRIMARY.default);
        this.controls.color.secondary = createColorPicker(CONFIG.CONTROLS.COLOR.SECONDARY.default);
        this.controls.color.background = createColorPicker(CONFIG.CONTROLS.COLOR.BACKGROUND.default);
        
        [this.controls.color.primary, 
         this.controls.color.secondary, 
         this.controls.color.background].forEach(picker => picker.parent(colorPickers));
    }

    setupAnimationControls() {
        const animationControls = select('#animation-controls');
        const animationConfig = CONFIG.CONTROLS.ANIMATION;
        
        // Animation preset selector
        this.controls.animation.preset = createSelect();
        this.controls.animation.preset.parent(animationControls);
        animationConfig.PRESET.options.forEach(option => {
            this.controls.animation.preset.option(option);
        });
        this.controls.animation.preset.value(animationConfig.PRESET.default);
        this.controls.animation.preset.style('margin-bottom', '12px');
        
        // Animation sliders
        this.controls.animation.speed = this.createSliderWithLabel('Speed', animationConfig.SPEED, animationControls);
        this.controls.animation.amplitude = this.createSliderWithLabel('Amplitude', animationConfig.AMPLITUDE, animationControls);
        this.controls.animation.frequency = this.createSliderWithLabel('Frequency', animationConfig.FREQUENCY, animationControls);
        
        // Show/hide animation sliders based on preset
        this.controls.animation.preset.changed(() => {
            const preset = this.controls.animation.preset.value();
            const showSliders = preset !== 'none';
            this.controls.animation.speed.slider.style('display', showSliders ? 'block' : 'none');
            this.controls.animation.amplitude.slider.style('display', showSliders ? 'block' : 'none');
            this.controls.animation.frequency.slider.style('display', showSliders ? 'block' : 'none');
        });
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
        this.setupColorControls();
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