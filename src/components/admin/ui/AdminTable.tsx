import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, ChevronDown } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

export function AdminTable<T extends Record<string, any>>({
  columns,
  data,
  pageSize = 50,
  searchPlaceholder = 'Buscar...',
  filters = [],
  onRowClick,
  emptyMessage = 'No hay datos disponibles.',
  emptyIcon,
}: AdminTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  // Filter + search
  let filtered = data.filter(row => {
    if (search) {
      const s = search.toLowerCase();
      const matches = Object.values(row).some(v =>
        String(v).toLowerCase().includes(s)
      );
      if (!matches) return false;
    }
    for (const [key, val] of Object.entries(activeFilters)) {
      if (val && row[key] !== val) return false;
    }
    return true;
  });

  // Sort
  if (sortKey) {
    filtered = [...filtered].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
          />
        </div>

        {filters.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white/50 hover:text-white hover:border-white/[0.12] transition-all"
          >
            <Filter className="w-4 h-4" />
            Filtros
            {Object.values(activeFilters).filter(Boolean).length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-violet-500/20 text-violet-400 rounded-full">
                {Object.values(activeFilters).filter(Boolean).length}
              </span>
            )}
          </button>
        )}

        <span className="text-xs text-white/20 ml-auto">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filter Row */}
      {showFilters && filters.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4 p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
          {filters.map(f => (
            <div key={f.key} className="relative">
              <select
                value={activeFilters[f.key] || ''}
                onChange={e => {
                  setActiveFilters({ ...activeFilters, [f.key]: e.target.value });
                  setCurrentPage(1);
                }}
                className="appearance-none pl-3 pr-8 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-xs text-white/60 focus:outline-none focus:ring-1 focus:ring-violet-500/30 cursor-pointer"
              >
                <option value="">{f.label}: Todos</option>
                {f.options.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 pointer-events-none" />
            </div>
          ))}
          <button
            onClick={() => { setActiveFilters({}); setCurrentPage(1); }}
            className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Table */}
      <div className="border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/[0.02]">
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => {
                      if (!col.sortable) return;
                      if (sortKey === col.key) {
                        setSortDir(d => d === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortKey(col.key);
                        setSortDir('asc');
                      }
                    }}
                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30 
                      ${col.sortable ? 'cursor-pointer hover:text-white/50 transition-colors' : ''}
                      ${col.width || ''}
                    `}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      {emptyIcon}
                      <p className="text-sm text-white/30">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((row, i) => (
                  <tr
                    key={i}
                    onClick={() => onRowClick?.(row)}
                    className={`transition-all duration-200 ${onRowClick ? 'cursor-pointer hover:bg-[rgba(108,92,231,0.06)] hover:translate-x-1 hover:border-l-2 hover:border-l-violet-500' : ''}`}
                  >
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-3.5 text-sm text-white/70">
                        {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-white/20">
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              if (page > totalPages) return null;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors
                    ${page === currentPage ? 'bg-violet-500/20 text-violet-400' : 'text-white/30 hover:text-white hover:bg-white/[0.05]'}
                  `}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
