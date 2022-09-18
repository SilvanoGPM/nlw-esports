import { useEffect, useState } from "react";

import { GameBanner } from "./components/GameBanner";
import { CreateAdBanner } from "./components/CreateAdBanner";

import nlwLogo from "./assets/logo-nlw-esports.svg";

interface Game {
  id: string;
  title: string;
  bannerUrl: string;
  _count: { ads: number };
}

export function App() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    async function loadGames() {
      const response = await fetch("http://localhost:3333/games");
      const games = await response.json();

      setGames(games);
    }

    loadGames();
  }, []);

  return (
    <div className="max-w-[1344px] mx-auto px-8 flex flex-col items-center my-20">
      <img src={nlwLogo} alt="Nome Esports com NLW embaixo" />

      <h1 className="text-6xl text-white font-black mt-20">
        Seu{" "}
        <span className="bg-nlw-gradient bg-clip-text text-transparent">
          duo
        </span>{" "}
        está aqui
      </h1>

      <div className="grid grid-cols-6 gap-6 mt-16 w-full">
        {games.map((game) => (
          <GameBanner key={game.id} {...game} adsCount={game._count.ads} />
        ))}
      </div>

      <CreateAdBanner />
    </div>
  );
}
