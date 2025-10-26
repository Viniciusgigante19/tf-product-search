import { useEffect, useState, useRef } from "react";
import { ProductModel } from "@app/js/app.types";
import { formatDate, formatPrice } from "@app/js/services/helpers";
import productDeleteApi from "@app/js/services/api/productDeleteApi";
import productListApi from "@app/js/services/api/productListApi";
import { ProductListProps } from "./ProductList.types";
import Pagination from "../Pagination/Pagination";

export default function ProductList({ products: initialProducts, onDelete }: ProductListProps) {
  const [products, setProducts] = useState<ProductModel[] | "error" | undefined>(initialProducts);
  const [searchItem, setSearchItem] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debounceRef = useRef<number | null>(null);
  const limit = 10;

  const fetchProducts = async (query?: string, page = 1) => {
    const resp = await productListApi(limit, "id,desc", query, page);
    if ("error" in resp) return setProducts("error");
    setProducts(resp.rows);

    setCurrentPage(page);
    setTotalPages(Math.ceil(resp.count / limit));
  };

 
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(() => {
      fetchProducts(searchItem, 1); 
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchItem]);

  const deleteProductHandler = (id: number) => {
    return async (event: React.MouseEvent<HTMLButtonElement>) => {
      const res = await productDeleteApi(id);
      if (res !== null) return;
      onDelete?.();
      fetchProducts(searchItem, currentPage);
    };
  };

  if (!products) {
    return (
      <div className="alert alert-light border d-flex align-items-center gap-2">
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Carregando produtos...
      </div>
    );
  }

  if (products === "error") {
    return <div className="alert alert-warning">Erro na API.</div>;
  }

  return (
    <div className="col-12 col-lg-8">
      {/* Campo de busca */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control rounded-4"
          placeholder="Buscar produto..."
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        />
      </div>

      {products.length === 0 ? (
        <div className="alert alert-warning">Nenhum produto encontrado.</div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {products.map((product) => {
              const id = product.id;
              return (
                <div key={id} className="col">
                  <div className="card h-100 border-0 shadow-sm rounded-4">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-title mb-0 fw-semibold">{product.name}</h6>
                        <span className="badge text-bg-light border">
                          {formatPrice(product.price_times_thousand)}
                        </span>
                      </div>

                      <p className="card-text text-muted small mt-2 mb-0">
                        <i className="fa-regular fa-clock me-1" aria-hidden="true"></i>
                        Cadastrado em {formatDate(product.created_at)}
                      </p>
                    </div>

                    <div className="card-footer bg-white border-0 pt-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge rounded-pill text-bg-primary">#{product.id}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={deleteProductHandler(id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paginação */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => fetchProducts(searchItem, page)}
          />
        </>
      )}
    </div>
  );
}
