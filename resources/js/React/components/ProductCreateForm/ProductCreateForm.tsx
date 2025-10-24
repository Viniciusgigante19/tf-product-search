import { useState } from "react";
import { ProductCreateFormProps } from "./ProductsCreateForm.types";
import productCreateApi from "@app/js/services/api/productCreateApi";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  label?: string;
}

export default function ProductCreateAndSearch({ onCreate }: ProductCreateFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // --- Handlers de cadastro ---
  const changePriceHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };

  const changeNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onCreateHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = await productCreateApi(name, price);

    if ("error" in data) {
      setErrorMsg(data.error);
      return;
    }

    setName("");
    setPrice("");
    setErrorMsg(null);
    onCreate?.(); // mantém o comportamento original
  };

  // --- Handler de pesquisa ---
  const onSearchHandler = (query: string) => {
    setSearchQuery(query.trim());
    console.log("Buscando por:", query);
    // Aqui você pode chamar o fetch dos produtos com filtro
  };

  return (
    <div className="row g-4">
      {/* --- Formulário de Cadastro --- */}
      <div className="col-12 col-lg-6">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-body">
            <h5 className="card-title mb-3">Cadastrar produto</h5>

            {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}

            <form onSubmit={onCreateHandler} className="vstack gap-3">
              <div>
                <label htmlFor="prodName" className="form-label">Nome</label>
                <input
                  id="prodName"
                  className="form-control w-100"
                  placeholder="Ex.: Teclado Mecânico"
                  value={name}
                  onChange={changeNameHandler}
                />
              </div>

              <div>
                <label htmlFor="prodPrice" className="form-label">Preço</label>
                <div className="input-group">
                  <span className="input-group-text">R$</span>
                  <input
                    id="prodPrice"
                    className="form-control"
                    placeholder="Ex.: 199,90"
                    value={price}
                    onChange={changePriceHandler}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                <i className="fa-solid fa-plus me-2" aria-hidden="true"></i>
                Cadastrar
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- Barra de Pesquisa --- */}
      <div className="col-12 col-lg-6">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-body">
            <h5 className="card-title mb-3">Pesquisar produtos</h5>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearchHandler(searchQuery);
              }}
              className="vstack gap-3"
            >
              <div>
                <label htmlFor="searchQuery" className="form-label">
                  Termo de busca
                </label>
                <div className="input-group">
                  <input
                    id="searchQuery"
                    type="text"
                    className="form-control"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">
                    <i className="fa-solid fa-magnifying-glass me-2" aria-hidden="true"></i>
                    Buscar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
