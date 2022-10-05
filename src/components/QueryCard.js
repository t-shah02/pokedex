import React from 'react'
import { useState, useEffect } from 'react';
import PokemonCard from './PokemonCard';
import "./styles/QueryCard.css"

export default function QueryCard() {

  const BASE_URL = "https://pokeapi.co/api/v2/pokemon"
  const L_STORAGE_INVALID = "invalid"
  const L_STORAGE_VALID = "valid"

  const [query, setQuery] = useState("")
  const [invalidQuery, setInvalidQuery] = useState("")
  const [result, setResult] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    if (localStorage.getItem(L_STORAGE_VALID) === null) {
      localStorage.setItem(L_STORAGE_VALID, JSON.stringify({}))
    }

    if (localStorage.getItem(L_STORAGE_INVALID) === null) {
      localStorage.setItem(L_STORAGE_INVALID, JSON.stringify({}))
    }

  }, [])

  async function handleKeypressSearch(e) {
    if (e.code === "Enter") {
      await findPokemon()
    }
  }


  async function findPokemon() {
    if (query === "") return

    const invalidSearches = JSON.parse(localStorage.getItem(L_STORAGE_INVALID))
    const validSearches = JSON.parse(localStorage.getItem(L_STORAGE_VALID))

    if (invalidSearches.hasOwnProperty(query)) {
      setResult(false)
      setInvalidQuery(query)

      if (!loaded) {
        setLoaded(true);
      }

      return
    }

    if (validSearches.hasOwnProperty(query)) {
      setResult(validSearches[query])
      
      if (!loaded) {
        setLoaded(true)
      }
      
      return
    }

    setLoading(true)
    const response = await fetch(`${BASE_URL}/${query}`)

    if (response.ok) {
      const pokemonData = await response.json()
      const info = {
        name: pokemonData.name,
        stats: pokemonData.stats,
        weight: pokemonData.weight,
        types: pokemonData.types,
        sprites: pokemonData.sprites,
        baseExperience: pokemonData.base_experience,
        height: pokemonData.height
      }

      setResult(info)
      validSearches[query] = info
      localStorage.setItem(L_STORAGE_VALID,JSON.stringify(validSearches))

    }
    else {
      invalidSearches[query] = true
      localStorage.setItem(L_STORAGE_INVALID, JSON.stringify(invalidSearches))

      setResult(false);
      setInvalidQuery(query)
    }

    if (!loaded) {
      setLoaded(true);
    }

    setLoading(false)

  }

  return (
    <div className="query-card">
      <div className="text-ctn">
        <h1 className="title">Welcome to the Pokedex</h1>
        <h2 className="subheading">Enter your favourite Pokemon name, and learn more about it!</h2>
      </div>


      <div className="poke-search-box">
        <input onKeyDown={handleKeypressSearch} onInput={(e) => setQuery(e.target.value.toLowerCase())} className="input" type="text" placeholder="Enter a pokemon name" />
        <button onClick={findPokemon} className="button is-success search-btn">
          Find
          <i className="gg-pokemon"></i>
        </button>
      </div>

       {loading ? <div className="lds-facebook"><div></div><div></div><div></div></div> : null}

      {loaded ? (result ? <PokemonCard data={result}/> : <h1 className="not-found-txt"> A pokemon called {invalidQuery} does not exist! </h1>) : null}




    </div>
  );
}
