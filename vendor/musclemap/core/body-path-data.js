import { maleFrontPaths } from '../data/male-front-paths.js';
import { maleBackPaths } from '../data/male-back-paths.js';
import { femaleFrontPaths } from '../data/female-front-paths.js';
import { femaleBackPaths } from '../data/female-back-paths.js';
// ─── ViewBox Definitions ─────────────────────────────────────────────────────
const VIEW_BOXES = {
    'male-front': { originX: 0, originY: 95, width: 727, height: 1280 },
    'male-back': { originX: 718, originY: 95, width: 727, height: 1280 },
    'female-front': { originX: 0, originY: 0, width: 650, height: 1450 },
    'female-back': { originX: 823, originY: 0, width: 650, height: 1450 },
};
/** Get the body parts path data for a given gender and side. */
export function getBodyPaths(gender, side) {
    const key = `${gender}-${side}`;
    switch (key) {
        case 'male-front': return maleFrontPaths;
        case 'male-back': return maleBackPaths;
        case 'female-front': return femaleFrontPaths;
        case 'female-back': return femaleBackPaths;
        default: return maleFrontPaths;
    }
}
/** Get the viewBox for a given gender and side. */
export function getViewBox(gender, side) {
    return VIEW_BOXES[`${gender}-${side}`] ?? VIEW_BOXES['male-front'];
}
