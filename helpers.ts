export const emulateRequest = async (data, delay: number): Promise<string> => new Promise(resolve => {
    setTimeout(() => resolve(JSON.stringify(data)), delay);
});

export const getResponse = (statusCode: number, body: string) => ({
    statusCode,
    headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET"
    },
    body
})