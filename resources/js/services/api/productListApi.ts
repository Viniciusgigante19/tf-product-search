import { ListApi, ProductModel } from "@app/js/app.types";
import { baseAxios } from "../axiosApi";
import catchError from "../catchError";

export default async function productListApi(
    limit = 15,
    orderBy = "id,desc",
    searchQuery?: string,
    page = 1
) {
    const offset = (page - 1) * limit;

    const query = new URLSearchParams({
        orderBy,
        limit: limit.toString(),
        offset: offset.toString(),
    });

    if (searchQuery) {
        query.append("query", searchQuery); 
    }

    try {
        const { data } = await baseAxios.get<ListApi<ProductModel>>(`api/products?${query}`);
        return data;
    } catch (error) {
        return catchError(error);
    }
}
