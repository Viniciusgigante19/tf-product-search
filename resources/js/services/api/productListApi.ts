import { ListApi, ProductModel } from "@app/js/app.types";
import { baseAxios } from "../axiosApi";
import catchError from "../catchError";

export default async function productListApi(
  limit = 15,
  orderBy = "id,desc",
  query?: string // ADICIONADO
) {
  const params = new URLSearchParams({
    orderBy,
    limit: limit.toString(),
  });

  if (query) {
    params.append("query", query); // adiciona o filtro de busca
  }

  try {
    const { data } = await baseAxios.get<ListApi<ProductModel>>(
      `api/products?${params.toString()}`
    );
    return data;
  } catch (error) {
    return catchError(error);
  }
}
