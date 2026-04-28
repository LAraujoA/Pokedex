import { useState } from "react";
import { usePokemon } from "./hooks/usePokemon";
import { PokemonCard } from "./components/PokemonCard";
import { SearchBar } from "./components/SearchBar";
import { TypeFilter } from "./components/TypeFilter";
import { PokemonModal } from "./components/PokemonModal";
import "./App.css";

function App() {
  const { pokemonList, loading, error } = usePokemon(150);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const uniqueTypes = [
    ...new Set(
      pokemonList.flatMap((pokemon) =>
        pokemon.types.map((t) => t.type.name)
      )
    ),
  ];

  const filtered = pokemonList.filter((pokemon) => {
    const matchesSearch = pokemon.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType =
      selectedType === "all" ||
      pokemon.types.some((t) => t.type.name === selectedType);

    return matchesSearch && matchesType;
  });

  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="app">
      <header>
        <h1>Pokédex</h1>
        <SearchBar value={search} onChange={setSearch} />
        <TypeFilter
          types={uniqueTypes}
          selectedType={selectedType}
          onSelectType={setSelectedType}
        />
      </header>

      {loading ? (
        <div className="loading">Cargando Pokémon...</div>
      ) : (
        <main className="grid">
          {filtered.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onClick={() => setSelectedPokemon(pokemon)}
            />
          ))}
        </main>
      )}

      <PokemonModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
    </div>
  );
}

export default App;