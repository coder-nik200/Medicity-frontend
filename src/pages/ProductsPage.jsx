import {
  Search,
  ShoppingCart,
  FileText,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const initialFilters = {
  category: "",
  manufacturer: "",
  dosageForm: "",
  prescriptionRequired: "all",
  inStock: "",
  discount: "",
  sort: "popular",
};
const money = (value) => `₹${Number(value || 0).toFixed(2)}`;

export default function ProductsPage() {
  const navigate = useNavigate();
  const { incrementCart } = useCart();
  const [products, setProducts] = useState([]);
  const [options, setOptions] = useState({
    categories: [],
    manufacturers: [],
    dosageForms: [],
  });
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    api
      .get("/products/filters")
      .then((res) => setOptions(res.data.data))
      .catch(() => {});
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(
      async () => {
        try {
          setLoading(true);
          const params = {
            ...filters,
            q: search || undefined,
            page,
            limit: 24,
          };
          Object.keys(params).forEach(
            (key) =>
              (params[key] === "" ||
                params[key] === "all" ||
                params[key] === undefined) &&
              delete params[key],
          );
          const res = await api.get("/products", {
            params,
            signal: controller.signal,
          });
          setProducts(res.data.data || []);
          setPagination(res.data.pagination || {});
        } catch (error) {
          if (error.name !== "CanceledError")
            toast.error("Could not load medicines");
        } finally {
          setLoading(false);
        }
      },
      search ? 280 : 0,
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, filters, page]);
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (search.trim().length < 2) return setSuggestions([]);
      try {
        setSuggestions(
          (
            await api.get("/products/search/suggestions", {
              params: { q: search },
            })
          ).data.data || [],
        );
      } catch {
        setSuggestions([]);
      }
    }, 220);
    return () => clearTimeout(timer);
  }, [search]);

  // lock body scroll while the mobile filter drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFiltersOpen]);

  const setFilter = (key, value) => {
    setFilters((old) => ({ ...old, [key]: value }));
    setPage(1);
  };
  const addToCart = async (event, product) => {
    event.stopPropagation();
    if (!product.stock) return toast.error("This medicine is out of stock");
    if (product.prescriptionRequired)
      return navigate(`/upload-prescription?medicineId=${product._id}`);
    try {
      setAddingId(product._id);
      await api.post("/cart/add", { productId: product._id, quantity: 1 });
      incrementCart(1);
      toast.success("Added to cart");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Please sign in to add items",
      );
    } finally {
      setAddingId(null);
    }
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "sort" && value && value !== "all",
  ).length;

  const filterFields = (
    <>
      <Filter
        label="Category"
        value={filters.category}
        values={options.categories}
        onChange={(v) => setFilter("category", v)}
      />
      <Filter
        label="Manufacturer"
        value={filters.manufacturer}
        values={options.manufacturers}
        onChange={(v) => setFilter("manufacturer", v)}
      />
      <Filter
        label="Dosage form"
        value={filters.dosageForm}
        values={options.dosageForms}
        onChange={(v) => setFilter("dosageForm", v)}
      />
      <Filter
        label="Prescription"
        value={
          filters.prescriptionRequired === "all"
            ? ""
            : filters.prescriptionRequired
        }
        values={["true", "false"]}
        labels={{ true: "Prescription required", false: "Non-prescription" }}
        onChange={(v) => setFilter("prescriptionRequired", v || "all")}
      />
      <label className="flex gap-2 text-sm py-2">
        <input
          type="checkbox"
          checked={filters.inStock === "true"}
          onChange={(e) => setFilter("inStock", e.target.checked ? "true" : "")}
        />{" "}
        In stock only
      </label>
      <label className="flex gap-2 text-sm py-2">
        <input
          type="checkbox"
          checked={filters.discount === "true"}
          onChange={(e) =>
            setFilter("discount", e.target.checked ? "true" : "")
          }
        />{" "}
        Offers available
      </label>
      <button
        onClick={() => {
          setFilters(initialFilters);
          setPage(1);
        }}
        className="mt-3 text-sm font-semibold text-sky-700"
      >
        Clear filters
      </button>
    </>
  );

  return (
    <main className="min-h-screen bg-slate-50 py-6 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <p className="text-sm font-semibold text-emerald-700">
            Verified pharmacy catalogue
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Medicines & health products
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Search by brand, salt/composition, manufacturer or medicine name.
          </p>
        </div>
        <div className="relative mb-5">
          <Search
            className="absolute left-4 top-3.5 text-slate-400"
            size={20}
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search Crocin, paracetamol, tablets…"
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 shadow-sm outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-20 mt-2 w-full max-h-72 overflow-y-auto overflow-x-hidden rounded-xl border bg-white shadow-xl">
              {suggestions.map((item) => (
                <button
                  key={item._id}
                  onClick={() => navigate(`/products/${item._id}`)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50"
                >
                  <img
                    src={item.image}
                    className="h-9 w-9 flex-shrink-0 rounded object-contain"
                  />
                  <span className="min-w-0">
                    <b className="block text-sm truncate">{item.name}</b>
                    <small className="text-slate-500 block truncate">
                      {item.genericName || item.brand}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block rounded-2xl border border-slate-100 bg-white p-5 shadow-sm h-fit sticky top-24">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-4">
              <SlidersHorizontal size={18} /> Filters
            </div>
            {filterFields}
          </aside>
          <section>
            <div className="mb-4 hidden sm:flex justify-between gap-3 items-center">
              <span className="text-sm text-slate-500">
                {pagination.total || 0} products found
              </span>
              <select
                value={filters.sort}
                onChange={(e) => setFilter("sort", e.target.value)}
                className="rounded-lg border p-2 text-sm"
              >
                <option value="popular">Most popular</option>
                <option value="best-selling">Best selling</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest rated</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name-asc">A–Z</option>
                <option value="name-desc">Z–A</option>
              </select>
            </div>

            <div className="mb-4 flex items-center justify-between gap-3 sm:hidden">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm"
              >
                <SlidersHorizontal size={18} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-xs text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <select
                value={filters.sort}
                onChange={(e) => setFilter("sort", e.target.value)}
                className="flex-1 rounded-lg border p-2 text-sm min-w-0"
              >
                <option value="popular">Most popular</option>
                <option value="best-selling">Best selling</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest rated</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name-asc">A–Z</option>
                <option value="name-desc">Z–A</option>
              </select>
            </div>
            <p className="mb-3 text-xs text-slate-500 sm:hidden">
              {pagination.total || 0} products found
            </p>

            {loading ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 9 }, (_, i) => (
                  <div
                    key={i}
                    className="h-72 sm:h-80 animate-pulse rounded-2xl bg-slate-200"
                  />
                ))}
              </div>
            ) : products.length ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                {products.map((product) => (
                  <article
                    key={product._id}
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-3 sm:p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <img
                      loading="lazy"
                      src={product.image}
                      alt={product.name}
                      className="h-28 sm:h-36 lg:h-40 w-full object-contain"
                    />
                    <div className="mt-3">
                      <h2 className="font-bold text-slate-800 line-clamp-2 text-sm sm:text-base">
                        {product.name}
                      </h2>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                        {product.composition ||
                          product.genericName ||
                          product.manufacturer}
                      </p>
                      <p className="mt-2 text-xs text-slate-500 line-clamp-1">
                        {product.manufacturer}
                      </p>
                      {product.prescriptionRequired && (
                        <span className="inline-block mt-2 rounded bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800">
                          Prescription required
                        </span>
                      )}
                      <div className="mt-3 flex items-end justify-between gap-2">
                        <span className="min-w-0">
                          <b className="text-base sm:text-lg text-slate-900">
                            {money(product.discountPrice || product.price)}
                          </b>
                          {product.discountPrice && (
                            <small className="ml-1 text-slate-400 line-through">
                              {money(product.price)}
                            </small>
                          )}
                        </span>
                        <span className="text-xs text-emerald-700 whitespace-nowrap">
                          ★ {product.rating?.toFixed(1) || "—"}
                        </span>
                      </div>
                      <button
                        onClick={(event) => addToCart(event, product)}
                        disabled={addingId === product._id || !product.stock}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-2.5 text-xs sm:text-sm font-semibold text-white disabled:bg-slate-300"
                      >
                        <ShoppingCart size={16} />
                        {!product.stock ? (
                          "Out of stock"
                        ) : product.prescriptionRequired ? (
                          <>
                            <FileText size={15} /> Upload Rx
                          </>
                        ) : addingId === product._id ? (
                          "Adding…"
                        ) : (
                          "Add to cart"
                        )}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-8 sm:p-12 text-center text-slate-500">
                No medicine matches these filters. Try a generic name or clear a
                filter.
              </div>
            )}
            {pagination.pages > 1 && (
              <div className="mt-8 flex justify-center gap-3">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-lg border p-2 disabled:opacity-40"
                >
                  <ChevronLeft />
                </button>
                <span className="py-2 text-sm">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage(page + 1)}
                  className="rounded-lg border p-2 disabled:opacity-40"
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <SlidersHorizontal size={18} /> Filters
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            {filterFields}
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-4 w-full rounded-xl bg-sky-600 py-2.5 text-sm font-semibold text-white"
            >
              Show {pagination.total || 0} results
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function Filter({ label, value, values, labels = {}, onChange }) {
  return (
    <label className="mb-3 block text-sm font-medium text-slate-700">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm"
      >
        <option value="">All</option>
        {values.map((item) => (
          <option key={item} value={item}>
            {labels[item] || item}
          </option>
        ))}
      </select>
    </label>
  );
}
