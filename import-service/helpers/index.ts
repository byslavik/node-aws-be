import { ALLOWED_EXTENSIONS } from '../constants';

export const checkRequestedFile = (fileName: string) => {
    const splitFilename = fileName.split('.');

    return ALLOWED_EXTENSIONS.includes(splitFilename[splitFilename.length - 1])
}