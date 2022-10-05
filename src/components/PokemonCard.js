import React from 'react'
import "./styles/PokemonCard.css"

export default function PokemonCard(props) {

  const data = props.data

  const name = capitalizeAndClean(data.name)
  const types = data.types.map((typeObj) => capitalizeAndClean(typeObj.type.name)).join(",")

  function capitalizeAndClean(str) {
      const capitalize = str.charAt(0).toUpperCase() + str.slice(1)
      return capitalize.replaceAll("_"," ")
  }

  return (
    <div className="pokecard">
      <div className="card">
        <div className="card-image">
          <figure className="image is-4by3">
            <img src={data.sprites.front_default} alt={`${name} poses`}/>
          </figure>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-content">
              <p className="title is-4">{name}</p>
              <p className="subtitle is-6">Types: {types}</p>
              

            </div>
          </div>

          <div className="content">
            {data.stats.map((stat) => <p key={stat.stat.name} style={{marginBottom:"0"}}>{capitalizeAndClean(stat.stat.name)} : {stat.base_stat}</p>)}
          </div>
        </div>
      </div>
    </div>
  )
}
