import { describe, expect, it, test } from '@jest/globals';

import { generateRandom } from './generate-random';

/**
 * PROCESS
 1. FAIL 
 2. PASS
 3. REFACTOR
 */

describe('generation de random number', ()=>{
    it('should generate a random number between 0 and 10', () => {
        const result = generateRandom(10);
        console.log('result:', result)
        expect(result).toBeLessThan(11);
        expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should be a number', () => {  // TEST CASE
        const result = generateRandom(10);
        expect(Number.isInteger(result)).toBe(true);
    });
});
