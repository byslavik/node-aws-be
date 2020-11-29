import { EFFECTS } from './../constants';

export const getEffect = (decodedPass, storedPass) => {
    if (storedPass && decodedPass === storedPass) {
        return EFFECTS.ALLOW;
    }
    return EFFECTS.DENY;
}
