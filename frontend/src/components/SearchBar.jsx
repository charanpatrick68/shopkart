const CATEGORIES = ["All Categories", "Electronics", "Fashion", "Books", "Home"];

const SearchBar = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}) => {
  return (
    <div className="grid w-full grid-cols-1 gap-3 rounded-md border border-[#e7ebe3] bg-white p-3 sm:grid-cols-[minmax(0,1fr)_190px_190px]">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search the collection"
        aria-label="Search products"
        className="min-w-0 rounded-sm bg-[#f7f8f4] px-4 py-3 text-sm text-[#202720] outline-none placeholder:text-[#879087] focus:ring-2 focus:ring-[#a7c76c]"
      />

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        aria-label="Filter by category"
        className="rounded-sm border border-[#e4e8e0] bg-white px-4 py-3 text-sm text-[#38433b] outline-none focus:ring-2 focus:ring-[#a7c76c]"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort products"
        className="rounded-sm border border-[#e4e8e0] bg-white px-4 py-3 text-sm text-[#38433b] outline-none focus:ring-2 focus:ring-[#a7c76c]"
      >
        <option value="newest">Sort: Recommended</option>
        <option value="price_asc">Price: Low to high</option>
        <option value="price_desc">Price: High to low</option>
      </select>
    </div>
  );
};

export default SearchBar;
