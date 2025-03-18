import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import axios from "axios";

const App = () => {
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [clickedCards, setClickedCards] = useState(new Set());

  useEffect(() => {
    fetchPokemon();
  }, []);

  const fetchPokemon = async () => {
    try {
      const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=8");
      const fetchedCards = await Promise.all(
        response.data.results.map(async (pokemon) => {
          const details = await axios.get(pokemon.url);
          return {
            id: details.data.id,
            name: details.data.name,
            image: details.data.sprites.front_default,
          };
        })
      );
      setCards(shuffleArray(fetchedCards));
    } catch (error) {
      console.error("Error fetching Pokémon data", error);
    }
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleCardClick = (id) => {
    if (clickedCards.has(id)) {
      setScore(0);
      setClickedCards(new Set());
    } else {
      const newClickedCards = new Set(clickedCards);
      newClickedCards.add(id);
      setClickedCards(newClickedCards);
      setScore(score + 1);
      if (score + 1 > bestScore) {
        setBestScore(score + 1);
      }
    }
    setCards(shuffleArray([...cards]));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-4">Pokémon Memory Game</h1>
      <div className="flex gap-4 text-xl">
        <p>Score: {score}</p>
        <p>Best Score: {bestScore}</p>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-6">
        {cards.map((card) => (
          <Card
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className="cursor-pointer p-4 bg-gray-800 rounded-lg shadow-md hover:scale-105 transition"
          >
            <CardContent className="flex flex-col items-center">
              <img src={card.image} alt={card.name} className="w-24 h-24" />
              <p className="mt-2 text-lg capitalize">{card.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button onClick={fetchPokemon} className="mt-6 bg-blue-500 hover:bg-blue-600">
        Reset Game
      </Button>
    </div>
  );
};

export default App;
