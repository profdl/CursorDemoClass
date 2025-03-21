export const CONFIG = {
    CANVAS: {
        WIDTH: 400,
        HEIGHT: 400,
        BACKGROUND: [255, 192, 203]
    },
    CONTROLS: {
        PATTERN: {
            SPACING: { min: 10, max: 100, default: 50, step: 1 },
            ROTATION: { min: 0, max: 45, default: 0, step: 1 },
            ROTATION_OFFSET: { min: 0, max: 360, default: 0, step: 1 },
            ROWS: { min: 1, max: 10, default: 3, step: 1 },
            COLS: { min: 1, max: 10, default: 5, step: 1 },
            RADIUS: { min: 50, max: 150, default: 100, step: 1 }
        },
        SHAPE: {
            HEIGHT: { min: 10, max: 200, default: 100, step: 1 },
            WIDTH: { min: 5, max: 50, default: 20, step: 1 }
        },
        ANIMATION: {
            SPEED: { min: 0.1, max: 5, default: 1, step: 0.1 }
        }
    },
    INTERACTION: {
        MOUSE_INFLUENCE_RADIUS: 100,
        RIPPLE_DURATION: 1000,
        RIPPLE_SPEED: 3,
        RIPPLE_WIDTH: 50
    }
}; 