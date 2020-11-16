import { checkRequestedFile } from './index';

describe('checkRequestedFile', () => {
    it('Should return true if extension is correct', () => {
        expect(checkRequestedFile('test.csv')).toBe(true);
    });
    it('Should return true if extension is correct and there is more that one dot in filename', () => {
        expect(checkRequestedFile('test.spredsheet.csv')).toBe(true);
    });
    it('Should return false if extension is not correct', () => {
        expect(checkRequestedFile('test.spredsheet.xlsx')).toBe(false);
    });
})