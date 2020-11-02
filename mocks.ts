export interface Car {
    id: string;
    brand: string;
    model: string;
    year: number;
    description: string;
    price: number;
    inStock: boolean;
    imgUrl: string;
}

export const cars: Car[] = [
    {
        id: '0',
        brand: 'Audi',
        model: 'A6',
        year: 2005,
        description: '',
        price: 10000,
        inStock: true,
        imgUrl: 'https://content.onliner.by/automarket/generations/136/256x192/879d1732e52056f106ac684b9f4ce845.png',
    },

    {
        id: '2',
        brand: 'Audi',
        model: 'A8',
        year: 2005,
        description: '',
        price: 15000,
        inStock: true,
        imgUrl: 'https://content.onliner.by/automarket/generations/136/256x192/5915a25667a7bf84b63a51a383b57013.png',
    },


    {
        id: '3',
        brand: 'Audi',
        model: 'A5',
        year: 2005,
        description: '',
        price: 12000,
        inStock: true,
        imgUrl: 'https://content.onliner.by/automarket/generations/136/256x192/037506bb2094bfb6d38546febe3c6bd4.png',
    }
]