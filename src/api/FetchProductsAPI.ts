import axios from "axios";

export const getProductsData = async (
    params: {
        search?: string;
        page?: number;
        limit?: number;
    } = {}
) => {
    const { search = '', page = 1, limit = 10 } = params;

    const url = new URL("https://stageapi.monkcommerce.app/task/products/search");
    
    url.searchParams.append('search', search);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    const apiKey = import.meta.env.VITE_X_API_KEY
    const { data } = await axios.get(url.toString(), {
        headers: {
            "x-api-key":  apiKey,
        },
    });

    return data;
};