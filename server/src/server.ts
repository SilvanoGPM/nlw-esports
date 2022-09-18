import express from "express";
import cors from 'cors';
import { PrismaClient } from "@prisma/client";
import { NotFoundError } from "@prisma/client/runtime";

import { convertHourStringToMinutes } from './util/convertHourStringToMinutes';
import { convertMinutesToHourString } from './util/convertMinutesToHourString';

const PORT = process.env.PORT || 3333;

const app = express();
const prisma = new PrismaClient({ log: ["query"] });

app.use(express.json());
app.use(cors());

app.get("/games", async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        },
      },
    },
  });

  return res.json(games);
});

app.post("/games/:id/ads", async (req, res) => {
  const gameId = req.params.id;

  const { body } = req;

  const createdAd = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(','),
      hourStart: convertHourStringToMinutes(body.hourStart),
      hourEnd: convertHourStringToMinutes(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel,
    },
  });

  return res.status(201).json(createdAd);
});

app.get("/games/:id/ads", async (req, res) => {
  const gameId = req.params.id;

  const ads = await prisma.ad.findMany({
    where: {
      gameId,
    },

    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return res.json(
    ads.map((ad) => ({
      ...ad,
      weekDays: ad.weekDays.split(","),
      hourStart: convertMinutesToHourString(ad.hourStart),
      hourEnd: convertMinutesToHourString(ad.hourEnd),
    }))
  );
});

app.get("/ads/:id/discord", async (req, res) => {
  const adId = req.params.id;

  try {
    const { discord } = await prisma.ad.findUniqueOrThrow({
      where: {
        id: adId,
      },

      select: {
        discord: true,
      },
    });

    return res.json({ discord });
  } catch (error) {
    if (error instanceof NotFoundError) {
      const { message, name } = error;

      return res.status(404).json({ message, name });
    }

    return res.status(error.status || 500).json({ ...error });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
