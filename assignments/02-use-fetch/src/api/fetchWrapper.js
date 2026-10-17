const requestInterceptors = [];
const responseInterceptors = [];

export const addRequestInterceptor = (interceptor) => {
    requestInterceptors.push(interceptor);
};

export const addResponseInterceptor = (interceptor) => {
    responseInterceptors.push(interceptor);
};

export const fetchWrapper = async (url, options = {}) => {
    let request = {
        url,
        options,
    };
    
    for (const interceptor of requestInterceptors) {
        request = await interceptor(request)
    }

    try {
        let response = await fetch(request.url, request.options)
        for (const interceptor of responseInterceptors) {
            response = await interceptor(response)
        }
        if (!response.ok) {
            throw new Error (
                `Request failed with status: ${response.status}`
            );
        }
        return response;
    } catch (error) {
        throw error;
    }
};