import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const QueryContext = createContext({});

export function QueryProvider({ children }) {
  const [search, setSearch] = useState(window.location.search);

  useEffect(() => {
    const update = () => setSearch(window.location.search);

    window.addEventListener("popstate", update);

    return () => {
      window.removeEventListener("popstate", update);
    };
  }, []);

  const queryParams = useMemo(() => {
    const searchParams = new URLSearchParams(search);

    return Array.from(searchParams.keys()).reduce((acc, key) => {
      const values = searchParams.getAll(key);
      acc[key] = values.length === 1 ? values[0] : values;
      return acc;
    }, {});
  }, [search]);

  return (
    <QueryContext.Provider value={queryParams}>
      {children}
    </QueryContext.Provider>
  );
}

export function useQuery() {
  return useContext(QueryContext);
}