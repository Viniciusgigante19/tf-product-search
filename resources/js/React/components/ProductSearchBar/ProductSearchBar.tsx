import { useState } from "react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  label?: string;
}

export default function SearchBar({ onSearch, placeholder = "Buscar...", label = "Pesquisar" }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <div className="col-12 col-lg-4">
      <div className="card border-0 shadow-sm rounded-4 h-100">
        <div className="card-body">
          <h5 className="card-title mb-3">{label}</h5>

          <form onSubmit={onSubmitHandler} className="vstack gap-3">
            <div>
              <label htmlFor="searchQuery" className="form-label">
                Termo de busca
              </label>
              <div className="input-group">
                <input
                  id="searchQuery"
                  type="text"
                  className="form-control"
                  placeholder={placeholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
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
  );
}
