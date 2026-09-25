import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  RotateCcw,
  Trophy,
  WifiOff,
  ShoppingBag,
  Play,
  Diamond,
  ArrowLeft,
  RefreshCw,
  Shield,
  Magnet,
  Zap,
  Heart,
  Palette,
  Sparkles,
  Pause,
} from "lucide-react";

import { playSound, playClick } from "../../../../javascript/media/sounds/sound";
import { EMOJIS } from "../../../../javascript/utils/emojis/emojis";

const GAME_HEIGHT = 390;
const GROUND_HEIGHT = 62;
const PLAYER_LEFT = 90;
const PLAYER_WIDTH = 42;
const PLAYER_HEIGHT = 64;
const PLAYER_DUCK_HEIGHT = 38;

const GRAVITY = 0.72;
const JUMP_FORCE = -16;
const INITIAL_GAME_SPEED = 5;
const MAX_GAME_SPEED = 11;
const MAGNET_RANGE = 200;
const MAGNET_PULL = 5.5;
const SPEED_DURATION = 8000;
const MAGNET_DURATION = 10000;
const DAY_DURATION = 30000;
const VICTORY_INTERVAL = 100;
const SPAWN_GRACE = 900;

const HIGH_SCORE_KEY = "portfolio_offline_game_high_score";
const DIAMONDS_KEY = "portfolio_offline_game_diamonds";
const COINS_KEY = "portfolio_offline_game_coins";
const SPECIAL_COINS_KEY = "portfolio_offline_game_special_coins";
const SELECTED_CHARACTER_KEY = "portfolio_offline_game_character";
const OWNED_CHARACTERS_KEY = "portfolio_offline_owned_characters";
const OWNED_ITEMS_KEY = "portfolio_offline_owned_items";

const FREE_CHARACTERS = ["classic-boy", "classic-girl"];

const emojiCategory = (category, fallback = []) => {
  const values = EMOJIS?.[category];

  if (Array.isArray(values) && values.length) {
    return values;
  }

  return fallback;
};

const SMILEYS = emojiCategory("Smileys", ["😀", "😎", "🤩", "😈"]);
const PEOPLE = emojiCategory("People", ["🧑", "👧", "👦", "🧙", "🧚"]);
const ANIMALS = emojiCategory("Animals", ["🐦", "🐱", "🐶", "🦊"]);
const NATURE = emojiCategory("Nature", ["🍃", "🍂", "❄️", "🌸"]);
const FOOD = emojiCategory("Food", ["🍎", "🍔", "🍕"]);
const TRAVEL = emojiCategory("Travel", ["🚀", "✈️", "🌍"]);
const OBJECTS = emojiCategory("Objects", ["🛡️", "🧲", "💡", "🎯"]);
const SYMBOLS = emojiCategory("Symbols", ["⭐", "✨", "💥", "❤️"]);
const TECH = emojiCategory("Tech", ["🤖", "💻", "📱"]);
const MONEY = emojiCategory("Money", ["🪙", "💎", "💰"]);

const pickEmoji = (collection, index = 0) => {
  if (!collection?.length) return "✨";
  return collection[index % collection.length];
};

const EMOJI = {
  classicBoy: pickEmoji(PEOPLE, 0),
  classicGirl: pickEmoji(PEOPLE, 1),
  ninja: "🥷",
  cyber: pickEmoji(TECH, 0),
  shadow: pickEmoji(PEOPLE, 3),
  moon: pickEmoji(PEOPLE, 4),
  superhero: "🦸",
  superheroGirl: "🦸‍♀️",

  bird: pickEmoji(ANIMALS, 0),
  spike: "🌵",

  coin: pickEmoji(MONEY, 0),
  diamond: pickEmoji(MONEY, 1),
  specialCoin: pickEmoji(SYMBOLS, 0),

  shield: pickEmoji(OBJECTS, 0),
  magnet: pickEmoji(OBJECTS, 1),
  speed: "⚡",
  extraLife: pickEmoji(SYMBOLS, 3),

  spring: pickEmoji(NATURE, 0),
  autumn: pickEmoji(NATURE, 1),
  winter: pickEmoji(NATURE, 2),

  runner: "🏃",
  gameOver: pickEmoji(SYMBOLS, 2),
  checking: "⏳",
  online: "🌐",
  offline: "📡",
  light: "☀️",
  dark: "🌙",
  info: "💡",
};

const CHARACTERS = [
  {
    id: "classic-boy",
    name: "Classic Boy",
    gender: "boy",
    emoji: EMOJI.classicBoy,
    color: "#2563eb",
    price: 0,
    currency: "coins",
  },
  {
    id: "classic-girl",
    name: "Classic Girl",
    gender: "girl",
    emoji: EMOJI.classicGirl,
    color: "#ec4899",
    price: 0,
    currency: "coins",
  },
  {
    id: "ninja-boy",
    name: "Ninja Boy",
    gender: "boy",
    emoji: EMOJI.ninja,
    color: "#7c3aed",
    price: 100,
    currency: "coins",
  },
  {
    id: "ninja-girl",
    name: "Ninja Girl",
    gender: "girl",
    emoji: EMOJI.ninja,
    color: "#db2777",
    price: 100,
    currency: "coins",
  },
  {
    id: "cyber-boy",
    name: "Cyber Boy",
    gender: "boy",
    emoji: EMOJI.cyber,
    color: "#0891b2",
    price: 25,
    currency: "diamonds",
  },
  {
    id: "cyber-girl",
    name: "Cyber Girl",
    gender: "girl",
    emoji: EMOJI.cyber,
    color: "#c026d3",
    price: 25,
    currency: "diamonds",
  },
  {
    id: "shadow-boy",
    name: "Shadow Boy",
    gender: "boy",
    emoji: EMOJI.shadow,
    color: "#111827",
    price: 50,
    currency: "diamonds",
  },
  {
    id: "moon-girl",
    name: "Moon Girl",
    gender: "girl",
    emoji: EMOJI.moon,
    color: "#6366f1",
    price: 50,
    currency: "diamonds",
  },
  {
    id: "golden-boy",
    name: "Golden Boy",
    gender: "boy",
    emoji: EMOJI.superhero,
    color: "#f59e0b",
    price: 500,
    currency: "coins",
  },
  {
    id: "golden-girl",
    name: "Golden Girl",
    gender: "girl",
    emoji: EMOJI.superheroGirl,
    color: "#f59e0b",
    price: 500,
    currency: "coins",
  },
];

const SHOP_ITEMS = [
  {
    id: "shield",
    name: "Shield",
    description: "Blocks one obstacle hit.",
    icon: Shield,
    emoji: EMOJI.shield,
    price: 10,
    currency: "diamonds",
    type: "powerup",
  },
  {
    id: "magnet",
    name: "Coin Magnet",
    description: "Pulls nearby coins toward you for 10 seconds.",
    icon: Magnet,
    emoji: EMOJI.magnet,
    price: 15,
    currency: "diamonds",
    type: "powerup",
  },
  {
    id: "speed",
    name: "Speed Boost",
    description: "Temporary speed burst for 8 seconds.",
    icon: Zap,
    emoji: EMOJI.speed,
    price: 100,
    currency: "coins",
    type: "powerup",
  },
  {
    id: "extra-life",
    name: "Extra Life",
    description: "Survive one collision.",
    icon: Heart,
    emoji: EMOJI.extraLife,
    price: 25,
    currency: "diamonds",
    type: "powerup",
  },
  {
    id: "rainbow",
    name: "Rainbow Trail",
    description: "Adds a colorful trail behind you.",
    icon: Palette,
    emoji: "🌈",
    price: 150,
    currency: "coins",
    type: "effect",
  },
  {
    id: "sparkle",
    name: "Sparkle Effect",
    description: "Adds sparkling particles around you.",
    icon: Sparkles,
    emoji: "✨",
    price: 20,
    currency: "diamonds",
    type: "effect",
  },
];

const EXCHANGE_OPTIONS = [
  {
    id: "diamond-coins",
    title: "Diamonds → Coins",
    from: "diamonds",
    to: "coins",
    fromAmount: 25,
    toAmount: 100,
    fromIcon: EMOJI.diamond,
    toIcon: EMOJI.coin,
  },
  {
    id: "diamond-special",
    title: "Diamonds → Special Coins",
    from: "diamonds",
    to: "specialCoins",
    fromAmount: 25,
    toAmount: 10,
    fromIcon: EMOJI.diamond,
    toIcon: EMOJI.specialCoin,
  },
  {
    id: "coins-diamonds",
    title: "Coins → Diamonds",
    from: "coins",
    to: "diamonds",
    fromAmount: 100,
    toAmount: 1,
    fromIcon: EMOJI.coin,
    toIcon: EMOJI.diamond,
  },
  {
    id: "coins-special",
    title: "Coins → Special Coins",
    from: "coins",
    to: "specialCoins",
    fromAmount: 100,
    toAmount: 10,
    fromIcon: EMOJI.coin,
    toIcon: EMOJI.specialCoin,
  },
  {
    id: "special-coins",
    title: "Special Coins → Coins",
    from: "specialCoins",
    to: "coins",
    fromAmount: 10,
    toAmount: 100,
    fromIcon: EMOJI.specialCoin,
    toIcon: EMOJI.coin,
  },
];

function safeReadNumber(key, fallback = 0) {
  try {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function safeReadArray(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function saveNumber(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {}
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function getSeason(score) {
  if (score < 100) return "spring";
  if (score < 200) return "summer";
  if (score < 300) return "autumn";
  return "winter";
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getCurrencyIcon(currency) {
  if (currency === "diamonds") return EMOJI.diamond;
  if (currency === "specialCoins") return EMOJI.specialCoin;
  return EMOJI.coin;
}

function getGroundY(ducking) {
  return (
    GAME_HEIGHT -
    GROUND_HEIGHT -
    (ducking ? PLAYER_DUCK_HEIGHT : PLAYER_HEIGHT)
  );
}

function boxesOverlap(player, object, padding = 5) {
  return (
    player.right > object.left + padding &&
    player.left < object.right - padding &&
    player.bottom > object.top + padding &&
    player.top < object.bottom - padding
  );
}

export default function OfflineGame() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light"
  );

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const [shopOpen, setShopOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [connectionPrompt, setConnectionPrompt] = useState("checking");
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator !== "undefined" && navigator.onLine
  );
  const [shopCategory, setShopCategory] = useState("characters");

  const [score, setScore] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [specialCoinsCollected, setSpecialCoinsCollected] = useState(0);
  const [diamondsCollected, setDiamondsCollected] = useState(0);

  const [totalCoins, setTotalCoins] = useState(() =>
    safeReadNumber(COINS_KEY, 0)
  );

  const [totalSpecialCoins, setTotalSpecialCoins] = useState(() =>
    safeReadNumber(SPECIAL_COINS_KEY, 0)
  );

  const [diamonds, setDiamonds] = useState(() =>
    safeReadNumber(DIAMONDS_KEY, 0)
  );

  const [highScore, setHighScore] = useState(() =>
    safeReadNumber(HIGH_SCORE_KEY, 0)
  );

  const [selectedCharacter, setSelectedCharacter] = useState(() => {
    try {
      return (
        localStorage.getItem(SELECTED_CHARACTER_KEY) || "classic-boy"
      );
    } catch {
      return "classic-boy";
    }
  });

  const [ownedCharacters, setOwnedCharacters] = useState(() => {
    const saved = safeReadArray(OWNED_CHARACTERS_KEY, []);

    return [...new Set([...FREE_CHARACTERS, ...saved])];
  });

  const [ownedItems, setOwnedItems] = useState(() =>
    safeReadArray(OWNED_ITEMS_KEY, [])
  );

  const [season, setSeason] = useState("spring");
  const [displayedPlayerY, setDisplayedPlayerY] = useState(
    getGroundY(false)
  );

  const [ducking, setDucking] = useState(false);

  const [obstacles, setObstacles] = useState([]);
  const [coins, setCoins] = useState([]);
  const [specialCoins, setSpecialCoins] = useState([]);
  const [diamondsOnMap, setDiamondsOnMap] = useState([]);

  const [activeShield, setActiveShield] = useState(false);
  const [activeMagnet, setActiveMagnet] = useState(false);
  const [activeSpeed, setActiveSpeed] = useState(false);
  const [activeExtraLife, setActiveExtraLife] = useState(false);

  const [rainbowTrail, setRainbowTrail] = useState(false);
  const [sparkleEffect, setSparkleEffect] = useState(false);

  const gameActiveRef = useRef(false);
  const pausedRef = useRef(false);
  const collisionRef = useRef(false);

  const animationRef = useRef(null);

  const playerRef = useRef({
    y: getGroundY(false),
    velocityY: 0,
  });

  const lastTimeRef = useRef(0);
  const lastObstacleRef = useRef(0);
  const lastCoinRef = useRef(0);
  const lastSpecialCoinRef = useRef(0);
  const lastDiamondRef = useRef(0);

  const scoreRef = useRef(0);
  const gameStartedAt = useRef(0);

  const pausedAccumulatedRef = useRef(0);
  const pauseStartedAtRef = useRef(0);

  const victoryScoreRef = useRef(0);
  const duckingRef = useRef(false);
  const themeRef = useRef(theme);

  const activeShieldRef = useRef(false);
  const activeMagnetRef = useRef(false);
  const activeSpeedRef = useRef(false);
  const activeExtraLifeRef = useRef(false);

  const powerTimersRef = useRef({
    magnet: null,
    speed: null,
  });

  const character =
    CHARACTERS.find((item) => item.id === selectedCharacter) ||
    CHARACTERS[0];

  const balances = useMemo(
    () => ({
      coins: totalCoins,
      diamonds,
      specialCoins: totalSpecialCoins,
    }),
    [totalCoins, diamonds, totalSpecialCoins]
  );

  const setBalance = useCallback((currency, updater) => {
    if (currency === "diamonds") {
      setDiamonds(updater);
    } else if (currency === "specialCoins") {
      setTotalSpecialCoins(updater);
    } else {
      setTotalCoins(updater);
    }
  }, []);

  const canAfford = useCallback(
    (currency, amount) => (balances[currency] ?? 0) >= amount,
    [balances]
  );

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      const currentTheme =
        root.getAttribute("data-theme") || "light";

      setTheme(currentTheme);
      themeRef.current = currentTheme;
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateConnection = () => {
      const online =
        typeof navigator !== "undefined" ? navigator.onLine : false;

      setIsOnline(online);

      if (!gameActiveRef.current && !running) {
        setConnectionPrompt(online ? "online" : "offline");
      }
    };

    const timer = window.setTimeout(updateConnection, 350);

    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("online", updateConnection);
      window.removeEventListener("offline", updateConnection);
    };
  }, [running]);

  useEffect(() => {
    saveNumber(DIAMONDS_KEY, diamonds);
  }, [diamonds]);

  useEffect(() => {
    saveNumber(COINS_KEY, totalCoins);
  }, [totalCoins]);

  useEffect(() => {
    saveNumber(SPECIAL_COINS_KEY, totalSpecialCoins);
  }, [totalSpecialCoins]);

  useEffect(() => {
    saveNumber(HIGH_SCORE_KEY, highScore);
  }, [highScore]);

  useEffect(() => {
    saveJSON(OWNED_CHARACTERS_KEY, ownedCharacters);
  }, [ownedCharacters]);

  useEffect(() => {
    saveJSON(OWNED_ITEMS_KEY, ownedItems);
  }, [ownedItems]);

  useEffect(() => {
    try {
      localStorage.setItem(
        SELECTED_CHARACTER_KEY,
        selectedCharacter
      );
    } catch {}
  }, [selectedCharacter]);

  const clearPowerTimers = useCallback(() => {
    window.clearTimeout(powerTimersRef.current.magnet);
    window.clearTimeout(powerTimersRef.current.speed);

    powerTimersRef.current = {
      magnet: null,
      speed: null,
    };
  }, []);

  const stopLoop = useCallback(() => {
    gameActiveRef.current = false;
    pausedRef.current = false;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const endGame = useCallback(() => {
    if (collisionRef.current) return;

    collisionRef.current = true;

    stopLoop();
    clearPowerTimers();

    setPaused(false);
    setRunning(false);
    setGameOver(true);

    playSound("error");

    window.setTimeout(() => {
      playSound("gameover");
    }, 120);

    const finalScore = scoreRef.current;

    setHighScore((current) => {
      const next = Math.max(current, finalScore);

      saveNumber(HIGH_SCORE_KEY, next);

      return next;
    });
  }, [clearPowerTimers, stopLoop]);

  const getPlayerBox = useCallback(() => {
    const height = duckingRef.current
      ? PLAYER_DUCK_HEIGHT
      : PLAYER_HEIGHT;

    return {
      left: PLAYER_LEFT,
      right: PLAYER_LEFT + PLAYER_WIDTH,
      top: playerRef.current.y,
      bottom: playerRef.current.y + height,
    };
  }, []);

  const applyMagnet = useCallback((item, speedStep) => {
    let nextX = item.x - speedStep;

    if (
      activeMagnetRef.current &&
      Math.abs(nextX - PLAYER_LEFT) < MAGNET_RANGE
    ) {
      nextX -= MAGNET_PULL;

      const playerCenterY =
        playerRef.current.y + PLAYER_HEIGHT / 2;

      const itemCenterY = item.y + item.height / 2;

      const pullY = Math.max(
        -3,
        Math.min(
          3,
          (playerCenterY - itemCenterY) * 0.08
        )
      );

      return {
        ...item,
        x: nextX,
        y: item.y + pullY,
      };
    }

    return {
      ...item,
      x: nextX,
    };
  }, []);

  const collectPickups = useCallback(
    (items, onCollect) => {
      const playerBox = getPlayerBox();
      const collected = [];

      for (const item of items) {
        if (
          boxesOverlap(playerBox, {
            left: item.x,
            right: item.x + item.width,
            top: item.y,
            bottom: item.y + item.height,
          })
        ) {
          collected.push(item);
        }
      }

      if (!collected.length) return items;

      collected.forEach(onCollect);

      const collectedIds = new Set(
        collected.map((item) => item.id)
      );

      return items.filter(
        (item) => !collectedIds.has(item.id)
      );
    },
    [getPlayerBox]
  );

  const gameLoop = useCallback(
    (timestamp) => {
      if (
        !gameActiveRef.current ||
        collisionRef.current ||
        pausedRef.current
      ) {
        return;
      }

      const delta = Math.min(
        timestamp - lastTimeRef.current || 16,
        40
      );

      lastTimeRef.current = timestamp;

      const elapsed =
        Date.now() -
        gameStartedAt.current -
        pausedAccumulatedRef.current;

      const newScore = Math.max(
        0,
        Math.floor(elapsed / 100)
      );

      scoreRef.current = newScore;

      setScore(newScore);

      const currentSeason = getSeason(newScore);

      setSeason((previous) =>
        previous === currentSeason
          ? previous
          : currentSeason
      );

      const milestone =
        Math.floor(newScore / VICTORY_INTERVAL) *
        VICTORY_INTERVAL;

      if (
        milestone > 0 &&
        victoryScoreRef.current !== milestone
      ) {
        victoryScoreRef.current = milestone;
        playSound("victory");
      }

      const baseSpeed = Math.min(
        INITIAL_GAME_SPEED + newScore / 120,
        MAX_GAME_SPEED
      );

      const speed = activeSpeedRef.current
        ? baseSpeed + 2.5
        : baseSpeed;

      const speedStep = speed * (delta / 16);

      const player = playerRef.current;

      player.velocityY +=
        GRAVITY * (delta / 16);

      player.y +=
        player.velocityY * (delta / 16);

      const targetGroundY = getGroundY(
        duckingRef.current
      );

      if (player.y >= targetGroundY) {
        player.y = targetGroundY;
        player.velocityY = 0;
      }

      if (player.y < 0) {
        player.y = 0;
        player.velocityY = 0;
      }

      setDisplayedPlayerY(player.y);

      const canSpawn = elapsed > SPAWN_GRACE;

      if (
        canSpawn &&
        timestamp - lastObstacleRef.current >
          Math.max(
            900 - newScore * 0.8,
            650
          )
      ) {
        lastObstacleRef.current = timestamp;

        const isBird = Math.random() < 0.3;

        setObstacles((current) => [
          ...current,
          {
            id: createId(),
            x: window.innerWidth + 80,
            y: isBird
              ? randomBetween(100, 205)
              : GAME_HEIGHT -
                GROUND_HEIGHT -
                48,
            width: isBird
              ? 54
              : randomBetween(30, 48),
            height: isBird ? 34 : 48,
            type: isBird ? "bird" : "spike",
          },
        ]);
      }

      if (
        canSpawn &&
        timestamp - lastCoinRef.current > 900
      ) {
        lastCoinRef.current = timestamp;

        setCoins((current) => [
          ...current,
          {
            id: createId(),
            x: window.innerWidth + 60,
            y: randomBetween(110, 275),
            width: 25,
            height: 25,
          },
        ]);
      }

      if (
        canSpawn &&
        timestamp - lastSpecialCoinRef.current >
          3500
      ) {
        lastSpecialCoinRef.current = timestamp;

        setSpecialCoins((current) => [
          ...current,
          {
            id: createId(),
            x: window.innerWidth + 100,
            y: randomBetween(90, 230),
            width: 32,
            height: 32,
          },
        ]);
      }

      if (
        canSpawn &&
        timestamp - lastDiamondRef.current >
          7000
      ) {
        lastDiamondRef.current = timestamp;

        setDiamondsOnMap((current) => [
          ...current,
          {
            id: createId(),
            x: window.innerWidth + 120,
            y: randomBetween(100, 250),
            width: 30,
            height: 30,
          },
        ]);
      }

      setObstacles((current) => {
        const moved = current
          .map((item) => ({
            ...item,
            x: item.x - speedStep,
          }))
          .filter((item) => item.x > -100);

        const playerBox = getPlayerBox();

        for (const obstacle of moved) {
          const hit = boxesOverlap(playerBox, {
            left: obstacle.x,
            right: obstacle.x + obstacle.width,
            top: obstacle.y,
            bottom: obstacle.y + obstacle.height,
          });

          if (!hit) continue;

          if (activeShieldRef.current) {
            activeShieldRef.current = false;
            setActiveShield(false);

            playSound("GameBonus");

            return moved.filter(
              (item) => item.id !== obstacle.id
            );
          }

          if (activeExtraLifeRef.current) {
            activeExtraLifeRef.current = false;
            setActiveExtraLife(false);

            playSound("GameBonus");

            return moved.filter(
              (item) => item.id !== obstacle.id
            );
          }

          endGame();

          return moved;
        }

        return moved;
      });

      setCoins((current) => {
        const moved = current
          .map((item) =>
            applyMagnet(item, speedStep)
          )
          .filter((item) => item.x > -80);

        return collectPickups(moved, () => {
          setCoinsCollected(
            (value) => value + 1
          );

          setTotalCoins(
            (value) => value + 1
          );

          playSound("GameBonus");
        });
      });

      setSpecialCoins((current) => {
        const moved = current
          .map((item) =>
            applyMagnet(item, speedStep)
          )
          .filter((item) => item.x > -80);

        return collectPickups(moved, () => {
          setSpecialCoinsCollected(
            (value) => value + 1
          );

          setTotalSpecialCoins(
            (value) => value + 1
          );

          playSound("GameBonus");
        });
      });

      setDiamondsOnMap((current) => {
        const moved = current
          .map((item) =>
            applyMagnet(item, speedStep)
          )
          .filter((item) => item.x > -80);

        return collectPickups(moved, () => {
          setDiamondsCollected(
            (value) => value + 1
          );

          setDiamonds(
            (value) => value + 1
          );

          playSound("GameBonus");
        });
      });

      animationRef.current =
        requestAnimationFrame(gameLoop);
    },
    [
      applyMagnet,
      collectPickups,
      endGame,
      getPlayerBox,
    ]
  );

  const startGame = useCallback(() => {
    playClick();

    if (animationRef.current) {
      cancelAnimationFrame(
        animationRef.current
      );
    }

    clearPowerTimers();

    gameActiveRef.current = true;
    pausedRef.current = false;
    collisionRef.current = false;

    setRunning(true);
    setPaused(false);
    setGameOver(false);
    setMenuOpen(false);
    setShopOpen(false);
    setExchangeOpen(false);

    setScore(0);
    scoreRef.current = 0;

    setCoinsCollected(0);
    setSpecialCoinsCollected(0);
    setDiamondsCollected(0);

    setObstacles([]);
    setCoins([]);
    setSpecialCoins([]);
    setDiamondsOnMap([]);

    setSeason("spring");

    activeShieldRef.current = false;
    activeMagnetRef.current = false;
    activeSpeedRef.current = false;
    activeExtraLifeRef.current = false;

    setActiveShield(false);
    setActiveMagnet(false);
    setActiveSpeed(false);
    setActiveExtraLife(false);

    setRainbowTrail(
      ownedItems.includes("rainbow")
    );

    setSparkleEffect(
      ownedItems.includes("sparkle")
    );

    playerRef.current = {
      y: getGroundY(false),
      velocityY: 0,
    };

    setDisplayedPlayerY(
      getGroundY(false)
    );

    duckingRef.current = false;
    setDucking(false);

    const now = Date.now();

    gameStartedAt.current = now;
    pausedAccumulatedRef.current = 0;
    pauseStartedAtRef.current = 0;

    lastTimeRef.current =
      performance.now();

    lastObstacleRef.current = 0;
    lastCoinRef.current = 0;
    lastSpecialCoinRef.current = 0;
    lastDiamondRef.current = 0;

    victoryScoreRef.current = 0;

    animationRef.current =
      requestAnimationFrame(gameLoop);
  }, [
    clearPowerTimers,
    gameLoop,
    ownedItems,
  ]);

  const resetGame = useCallback(
    () => startGame(),
    [startGame]
  );

  const leaveGame = useCallback(() => {
    playClick();

    stopLoop();
    clearPowerTimers();

    setRunning(false);
    setPaused(false);
    setGameOver(false);
    setShopOpen(false);
    setExchangeOpen(false);

    if (window.history.length > 1) {
      window.history.back();
    }
  }, [
    clearPowerTimers,
    stopLoop,
  ]);

  const continueToGame = useCallback(() => {
    playClick();

    setConnectionPrompt(null);

    startGame();
  }, [startGame]);

  const keepWaiting = useCallback(() => {
    playClick();

    setConnectionPrompt(
      isOnline ? "online" : "offline"
    );
  }, [isOnline]);

  const jump = useCallback(() => {
    if (
      !gameActiveRef.current ||
      pausedRef.current
    ) {
      return;
    }

    const player = playerRef.current;

    const groundY = getGroundY(false);

    if (
      player.y >= groundY - 6 ||
      (
        duckingRef.current &&
        player.y >=
          getGroundY(true) - 6
      )
    ) {
      player.velocityY = JUMP_FORCE;

      duckingRef.current = false;

      setDucking(false);

      playSound("jump");
    }
  }, []);

  const setDuck = useCallback((value) => {
    if (
      !gameActiveRef.current ||
      pausedRef.current
    ) {
      return;
    }

    duckingRef.current = value;

    setDucking(value);

    const player = playerRef.current;

    const standingGround =
      getGroundY(false);

    if (
      value &&
      player.y >= standingGround - 6
    ) {
      player.y = getGroundY(true);
      player.velocityY = 0;
    }
  }, []);

  const togglePause = useCallback(() => {
    if (!running || gameOver) return;

    if (pausedRef.current) {
      pausedAccumulatedRef.current +=
        Date.now() -
        pauseStartedAtRef.current;

      pausedRef.current = false;

      setPaused(false);

      lastTimeRef.current =
        performance.now();

      animationRef.current =
        requestAnimationFrame(gameLoop);

      return;
    }

    pausedRef.current = true;

    pauseStartedAtRef.current =
      Date.now();

    setPaused(true);

    if (animationRef.current) {
      cancelAnimationFrame(
        animationRef.current
      );

      animationRef.current = null;
    }
  }, [
    gameLoop,
    gameOver,
    running,
  ]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Escape") {
        event.preventDefault();

        togglePause();

        return;
      }

      if (
        event.code === "Space" ||
        event.code === "ArrowUp" ||
        event.code === "KeyW"
      ) {
        event.preventDefault();

        if (running && !paused) {
          jump();
        }
      }

      if (
        event.code === "ArrowDown" ||
        event.code === "KeyS"
      ) {
        event.preventDefault();

        setDuck(true);
      }
    };

    const handleKeyUp = (event) => {
      if (
        event.code === "ArrowDown" ||
        event.code === "KeyS"
      ) {
        event.preventDefault();

        setDuck(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    window.addEventListener(
      "keyup",
      handleKeyUp
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.removeEventListener(
        "keyup",
        handleKeyUp
      );
    };
  }, [
    jump,
    paused,
    running,
    setDuck,
    togglePause,
  ]);

  useEffect(() => {
    const handleTouch = (event) => {
      if (
        !gameActiveRef.current ||
        pausedRef.current
      ) {
        return;
      }

      const touch = event.touches[0];

      if (!touch) return;

      if (
        touch.clientY <
        window.innerHeight / 2
      ) {
        jump();
      } else {
        setDuck(true);
      }
    };

    const handleTouchEnd = () => {
      setDuck(false);
    };

    window.addEventListener(
      "touchstart",
      handleTouch,
      { passive: false }
    );

    window.addEventListener(
      "touchend",
      handleTouchEnd,
      { passive: false }
    );

    window.addEventListener(
      "touchcancel",
      handleTouchEnd,
      { passive: false }
    );

    return () => {
      window.removeEventListener(
        "touchstart",
        handleTouch
      );

      window.removeEventListener(
        "touchend",
        handleTouchEnd
      );

      window.removeEventListener(
        "touchcancel",
        handleTouchEnd
      );
    };
  }, [jump, setDuck]);

  useEffect(() => {
    if (
      themeRef.current !== "light" ||
      !running ||
      paused
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      document.documentElement.setAttribute(
        "data-theme",
        "dark"
      );
    }, DAY_DURATION);

    return () => {
      window.clearTimeout(timer);
    };
  }, [paused, running]);

  useEffect(() => {
    return () => {
      stopLoop();
      clearPowerTimers();
    };
  }, [
    clearPowerTimers,
    stopLoop,
  ]);

  const spend = useCallback(
    (currency, amount) => {
      if (
        !canAfford(currency, amount)
      ) {
        playSound("error");
        return false;
      }

      setBalance(
        currency,
        (value) => value - amount
      );

      return true;
    },
    [
      canAfford,
      setBalance,
    ]
  );

  const purchaseCharacter = (item) => {
    playClick();

    if (
      ownedCharacters.includes(item.id)
    ) {
      setSelectedCharacter(item.id);
      return;
    }

    if (
      !spend(
        item.currency,
        item.price
      )
    ) {
      return;
    }

    setOwnedCharacters(
      (current) => [
        ...current,
        item.id,
      ]
    );

    setSelectedCharacter(item.id);

    playSound("GameBonus");
  };

  const purchaseItem = (item) => {
    playClick();

    if (
      ownedItems.includes(item.id)
    ) {
      return;
    }

    if (
      !spend(
        item.currency,
        item.price
      )
    ) {
      return;
    }

    setOwnedItems(
      (current) => [
        ...current,
        item.id,
      ]
    );

    playSound("GameBonus");
  };

  const consumeItem = useCallback(
    (itemId) => {
      setOwnedItems(
        (current) =>
          current.filter(
            (id) => id !== itemId
          )
      );
    },
    []
  );

  const useItem = useCallback(
    (itemId) => {
      if (
        !ownedItems.includes(itemId)
      ) {
        return;
      }

      if (itemId === "shield") {
        if (activeShieldRef.current) {
          return;
        }

        activeShieldRef.current = true;

        setActiveShield(true);

        consumeItem(itemId);
      }

      if (itemId === "magnet") {
        if (activeMagnetRef.current) {
          return;
        }

        activeMagnetRef.current = true;

        setActiveMagnet(true);

        consumeItem(itemId);

        window.clearTimeout(
          powerTimersRef.current.magnet
        );

        powerTimersRef.current.magnet =
          window.setTimeout(() => {
            activeMagnetRef.current = false;
            setActiveMagnet(false);
          }, MAGNET_DURATION);
      }

      if (itemId === "speed") {
        if (activeSpeedRef.current) {
          return;
        }

        activeSpeedRef.current = true;

        setActiveSpeed(true);

        consumeItem(itemId);

        window.clearTimeout(
          powerTimersRef.current.speed
        );

        powerTimersRef.current.speed =
          window.setTimeout(() => {
            activeSpeedRef.current = false;
            setActiveSpeed(false);
          }, SPEED_DURATION);
      }

      if (itemId === "extra-life") {
        if (
          activeExtraLifeRef.current
        ) {
          return;
        }

        activeExtraLifeRef.current = true;

        setActiveExtraLife(true);

        consumeItem(itemId);
      }

      if (itemId === "rainbow") {
        setRainbowTrail(true);
      }

      if (itemId === "sparkle") {
        setSparkleEffect(true);
      }

      playSound("GameBonus");
    },
    [
      consumeItem,
      ownedItems,
    ]
  );

  const exchange = (option) => {
    playClick();

    if (
      !spend(
        option.from,
        option.fromAmount
      )
    ) {
      return;
    }

    setBalance(
      option.to,
      (value) =>
        value + option.toAmount
    );

    playSound("GameBonus");
  };

  const openShop = () => {
    playClick();

    setShopOpen(true);
    setExchangeOpen(false);
    setMenuOpen(false);
  };

  const openExchange = () => {
    playClick();

    setExchangeOpen(true);
    setShopOpen(false);
    setMenuOpen(false);
  };

  const returnToMenu = () => {
    playClick();

    stopLoop();
    clearPowerTimers();

    setRunning(false);
    setPaused(false);
    setGameOver(false);

    setShopOpen(false);
    setExchangeOpen(false);

    setMenuOpen(true);
    setConnectionPrompt(null);
  };

  const seasonalParticles = useMemo(() => {
    const items = [];

    if (season === "spring") {
      for (let i = 0; i < 14; i += 1) {
        items.push({
          key: `spring-${i}`,
          className:
            "season-particle spring-particle",
          emoji: pickEmoji(
            NATURE,
            i
          ),
          left: randomBetween(0, 100),
          delay: randomBetween(0, 5),
          duration: randomBetween(4, 8),
        });
      }
    }

    if (season === "autumn") {
      for (let i = 0; i < 14; i += 1) {
        items.push({
          key: `autumn-${i}`,
          className:
            "season-particle autumn-particle",
          emoji: pickEmoji(
            NATURE,
            i + 2
          ),
          left: randomBetween(0, 100),
          delay: randomBetween(0, 5),
          duration: randomBetween(4, 8),
        });
      }
    }

    if (season === "winter") {
      for (let i = 0; i < 20; i += 1) {
        items.push({
          key: `winter-${i}`,
          className:
            "season-particle snow-particle",
          emoji: pickEmoji(
            NATURE,
            i + 4
          ),
          left: randomBetween(0, 100),
          delay: randomBetween(0, 5),
          duration: randomBetween(5, 9),
        });
      }
    }

    return items;
  }, [season]);

  const usablePowerups = SHOP_ITEMS.filter(
    (item) =>
      item.type === "powerup" &&
      ownedItems.includes(item.id)
  );

  return (
    <section
      className={`offline-game game-${theme} game-${season}`}
    >
      {connectionPrompt && (
        <div className="connection-prompt-overlay">
          <div className="connection-prompt-card">
            <div className="connection-prompt-icon">
              {connectionPrompt === "checking"
                ? EMOJI.checking
                : isOnline
                  ? EMOJI.online
                  : EMOJI.offline}
            </div>

            {connectionPrompt === "checking" ? (
              <>
                <h2>
                  Checking connection...
                </h2>

                <p>
                  Please wait a moment.
                </p>
              </>
            ) : isOnline ? (
              <>
                <span className="connection-status online">
                  ● Internet Connected
                </span>

                <h2>
                  Internet is working
                </h2>

                <p>
                  The internet connection is
                  available. Do you want to
                  exit the offline game or
                  continue playing?
                </p>

                <div className="connection-prompt-actions">
                  <button
                    className="secondary-game-button"
                    onClick={leaveGame}
                  >
                    Exit
                  </button>

                  <button
                    className="primary-game-button"
                    onClick={continueToGame}
                  >
                    <Play size={18} />
                    Continue Playing
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="connection-status offline">
                  ● No Internet Connection
                </span>

                <h2>
                  Play while you wait?
                </h2>

                <p>
                  There is no internet
                  connection right now.
                  Would you like to play
                  Offline Runner while you
                  wait?
                </p>

                <div className="connection-prompt-actions">
                  <button
                    className="secondary-game-button"
                    onClick={keepWaiting}
                  >
                    Keep Waiting
                  </button>

                  <button
                    className="primary-game-button"
                    onClick={continueToGame}
                  >
                    <Play size={18} />
                    Play Game
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="game-sky">
        <div className="sun">
          {EMOJI.light}
        </div>

        <div className="moon">
          {EMOJI.dark}
        </div>

        {seasonalParticles.map(
          (particle) => (
            <span
              key={particle.key}
              className={particle.className}
              style={{
                left: `${particle.left}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            >
              {particle.emoji}
            </span>
          )
        )}
      </div>

      <header className="game-header">
        <div className="game-title">
          <WifiOff size={18} />
          <span>
            Offline Runner
          </span>
        </div>

        <div className="game-stats">
          <div className="game-stat">
            {EMOJI.coin}
            <span>{totalCoins}</span>
          </div>

          <div className="game-stat">
            {EMOJI.specialCoin}
            <span>
              {totalSpecialCoins}
            </span>
          </div>

          <div className="game-stat diamond-stat">
            {EMOJI.diamond}
            <span>{diamonds}</span>
          </div>

          <div className="game-stat">
            <Trophy size={15} />
            <span>{highScore}</span>
          </div>
        </div>
      </header>

      <div className="game-score">
        <span>Score</span>
        <strong>{score}</strong>
      </div>

      {running && (
        <>
          <div
            className={`game-player ${
              ducking
                ? "player-ducking"
                : ""
            } ${
              rainbowTrail
                ? "rainbow-trail"
                : ""
            } ${
              sparkleEffect
                ? "sparkle-player"
                : ""
            }`}
            style={{
              top: `${displayedPlayerY}px`,
              "--player-color":
                character.color,
            }}
          >
            <div className="player-shadow" />

            {activeShield && (
              <div className="player-shield">
                {EMOJI.shield}
              </div>
            )}

            <div className="player-character">
              {character.emoji}
            </div>
          </div>

          {obstacles.map(
            (obstacle) => (
              <div
                key={obstacle.id}
                className={`game-obstacle ${
                  obstacle.type === "bird"
                    ? "obstacle-bird"
                    : "obstacle-spike"
                }`}
                style={{
                  left: `${obstacle.x}px`,
                  top: `${obstacle.y}px`,
                  width: `${obstacle.width}px`,
                  height: `${obstacle.height}px`,
                }}
              >
                {obstacle.type ===
                "bird"
                  ? EMOJI.bird
                  : EMOJI.spike}
              </div>
            )
          )}

          {coins.map((coin) => (
            <div
              key={coin.id}
              className="game-coin"
              style={{
                left: `${coin.x}px`,
                top: `${coin.y}px`,
              }}
            >
              {EMOJI.coin}
            </div>
          ))}

          {specialCoins.map(
            (coin) => (
              <div
                key={coin.id}
                className="game-special-coin"
                style={{
                  left: `${coin.x}px`,
                  top: `${coin.y}px`,
                }}
              >
                {EMOJI.specialCoin}
              </div>
            )
          )}

          {diamondsOnMap.map(
            (diamond) => (
              <div
                key={diamond.id}
                className="game-diamond"
                style={{
                  left: `${diamond.x}px`,
                  top: `${diamond.y}px`,
                }}
              >
                {EMOJI.diamond}
              </div>
            )
          )}

          <div className="game-ground">
            <div className="ground-line" />
          </div>

          <div className="active-items">
            {activeShield && (
              <span>
                {EMOJI.shield} Shield
              </span>
            )}

            {activeMagnet && (
              <span>
                {EMOJI.magnet} Magnet
              </span>
            )}

            {activeSpeed && (
              <span>
                {EMOJI.speed} Speed
              </span>
            )}

            {activeExtraLife && (
              <span>
                {EMOJI.extraLife} Extra Life
              </span>
            )}
          </div>

          {usablePowerups.length > 0 && (
            <div
              className="active-items"
              style={{
                top: "auto",
                bottom: "86px",
              }}
            >
              {usablePowerups.map(
                (item) => {
                  const ItemIcon =
                    item.icon;

                  return (
                    <button
                      key={item.id}
                      className="icon-game-button"
                      onClick={() =>
                        useItem(item.id)
                      }
                      title={`Use ${item.name}`}
                    >
                      <ItemIcon size={16} />
                      {item.name}
                    </button>
                  );
                }
              )}
            </div>
          )}
        </>
      )}

      {paused && running && (
        <div className="game-menu-overlay">
          <div className="game-menu-card">
            <div className="menu-logo">
              <Pause size={36} />
            </div>

            <h1>Paused</h1>

            <p>
              Take a breath. Your score
              is saved for this run.
            </p>

            <button
              className="primary-game-button"
              onClick={togglePause}
            >
              <Play size={19} />
              Resume
            </button>

            <button
              className="secondary-game-button"
              onClick={returnToMenu}
            >
              <ArrowLeft size={19} />
              Main Menu
            </button>
          </div>
        </div>
      )}

      {!running &&
        !gameOver &&
        menuOpen &&
        !connectionPrompt && (
          <div className="game-menu-overlay">
            <div className="game-menu-card">
              <div className="menu-logo">
                {EMOJI.runner}
              </div>

              <h1>
                Offline Runner
              </h1>

              <p>
                Run, collect coins, discover
                diamonds and unlock
                characters.
              </p>

              <div className="menu-currency-row">
                <span>
                  {EMOJI.coin} {totalCoins}
                </span>

                <span>
                  {EMOJI.specialCoin}{" "}
                  {totalSpecialCoins}
                </span>

                <span>
                  {EMOJI.diamond}{" "}
                  {diamonds}
                </span>
              </div>

              <button
                className="primary-game-button"
                onClick={startGame}
              >
                <Play size={19} />
                Start Game
              </button>

              <button
                className="secondary-game-button"
                onClick={openShop}
              >
                <ShoppingBag size={19} />
                Shop
              </button>

              <button
                className="secondary-game-button"
                onClick={openExchange}
              >
                <RefreshCw size={19} />
                Exchange
              </button>

              <div className="menu-best">
                <Trophy size={16} />
                Best Score: {highScore}
              </div>
            </div>
          </div>
        )}

      {shopOpen && (
        <div className="shop-overlay">
          <div className="shop-container">
            <div className="shop-header">
              <button
                className="icon-game-button"
                onClick={returnToMenu}
              >
                <ArrowLeft size={20} />
              </button>

              <div>
                <h2>
                  <ShoppingBag size={22} />
                  Game Shop
                </h2>

                <p>
                  Unlock characters,
                  power-ups and effects.
                </p>
              </div>

              <div className="shop-balances">
                <span>
                  {EMOJI.coin}{" "}
                  {totalCoins}
                </span>

                <span>
                  {EMOJI.specialCoin}{" "}
                  {totalSpecialCoins}
                </span>

                <span>
                  {EMOJI.diamond}{" "}
                  {diamonds}
                </span>
              </div>
            </div>

            <div className="shop-tabs">
              <button
                className={
                  shopCategory ===
                  "characters"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setShopCategory(
                    "characters"
                  )
                }
              >
                👥 Characters
              </button>

              <button
                className={
                  shopCategory ===
                  "powerups"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setShopCategory(
                    "powerups"
                  )
                }
              >
                ⚡ Power-ups
              </button>

              <button
                className={
                  shopCategory ===
                  "effects"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setShopCategory(
                    "effects"
                  )
                }
              >
                ✨ Effects
              </button>
            </div>

            {shopCategory ===
              "characters" && (
              <div className="character-grid">
                {CHARACTERS.map(
                  (item) => {
                    const owned =
                      ownedCharacters.includes(
                        item.id
                      );

                    const selected =
                      selectedCharacter ===
                      item.id;

                    return (
                      <div
                        key={item.id}
                        className={`character-card ${
                          selected
                            ? "selected"
                            : ""
                        }`}
                      >
                        <div
                          className="character-preview"
                          style={{
                            "--character-color":
                              item.color,
                          }}
                        >
                          <span>
                            {item.emoji}
                          </span>
                        </div>

                        <div className="character-info">
                          <h3>
                            {item.name}
                          </h3>

                          <span className="gender-label">
                            {item.gender ===
                            "boy"
                              ? "👦 Boy"
                              : "👧 Girl"}
                          </span>
                        </div>

                        {owned ? (
                          <button
                            className={
                              selected
                                ? "selected-button"
                                : "select-button"
                            }
                            onClick={() => {
                              playClick();

                              setSelectedCharacter(
                                item.id
                              );
                            }}
                          >
                            {selected
                              ? "✓ Selected"
                              : "Select"}
                          </button>
                        ) : (
                          <button
                            className="buy-button"
                            onClick={() =>
                              purchaseCharacter(
                                item
                              )
                            }
                          >
                            {item.price ===
                            0 ? (
                              "Free"
                            ) : (
                              <>
                                {getCurrencyIcon(
                                  item.currency
                                )}{" "}
                                {item.price}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            )}

            {(shopCategory ===
              "powerups" ||
              shopCategory ===
                "effects") && (
              <div className="item-grid">
                {SHOP_ITEMS.filter(
                  (item) =>
                    item.type ===
                    (shopCategory ===
                    "powerups"
                      ? "powerup"
                      : "effect")
                ).map((item) => {
                  const ItemIcon =
                    item.icon;

                  const owned =
                    ownedItems.includes(
                      item.id
                    );

                  return (
                    <div
                      className="item-card"
                      key={item.id}
                    >
                      <div className="item-icon">
                        <ItemIcon
                          size={28}
                        />
                      </div>

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        {item.description}
                      </p>

                      <div className="item-price">
                        {getCurrencyIcon(
                          item.currency
                        )}{" "}
                        {item.price}
                      </div>

                      {owned ? (
                        <button
                          className="selected-button"
                          onClick={() => {
                            playClick();
                            useItem(
                              item.id
                            );
                          }}
                        >
                          {item.type ===
                          "effect"
                            ? "Equip"
                            : "Ready"}
                        </button>
                      ) : (
                        <button
                          className="buy-button"
                          onClick={() =>
                            purchaseItem(
                              item
                            )
                          }
                        >
                          Buy
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {exchangeOpen && (
        <div className="exchange-overlay">
          <div className="exchange-container">
            <div className="exchange-header">
              <button
                className="icon-game-button"
                onClick={returnToMenu}
              >
                <ArrowLeft size={20} />
              </button>

              <div>
                <h2>
                  <RefreshCw size={22} />
                  Exchange Center
                </h2>

                <p>
                  Trade your currencies
                  for other rewards.
                </p>
              </div>
            </div>

            <div className="exchange-balances">
              <div>
                <span>
                  {EMOJI.diamond}
                </span>

                <strong>
                  {diamonds}
                </strong>

                <span>
                  Diamonds
                </span>
              </div>

              <div>
                <span>
                  {EMOJI.coin}
                </span>

                <strong>
                  {totalCoins}
                </strong>

                <span>
                  Coins
                </span>
              </div>

              <div>
                <span>
                  {EMOJI.specialCoin}
                </span>

                <strong>
                  {totalSpecialCoins}
                </strong>

                <span>
                  Special Coins
                </span>
              </div>
            </div>

            <div className="exchange-grid">
              {EXCHANGE_OPTIONS.map(
                (option) => (
                  <div
                    className="exchange-card"
                    key={option.id}
                  >
                    <h3>
                      {option.title}
                    </h3>

                    <div className="exchange-flow">
                      <div>
                        <span className="exchange-icon">
                          {option.fromIcon}
                        </span>

                        <strong>
                          {option.fromAmount}
                        </strong>
                      </div>

                      <span className="exchange-arrow">
                        →
                      </span>

                      <div>
                        <span className="exchange-icon">
                          {option.toIcon}
                        </span>

                        <strong>
                          {option.toAmount}
                        </strong>
                      </div>
                    </div>

                    <button
                      className="exchange-button"
                      onClick={() =>
                        exchange(option)
                      }
                    >
                      Exchange
                    </button>
                  </div>
                )
              )}
            </div>

            <div className="exchange-note">
              {EMOJI.info} Exchange
              rates are designed to
              make diamonds more
              valuable.
            </div>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-card">
            <div className="game-over-icon">
              {EMOJI.gameOver}
            </div>

            <h2>Game Over</h2>

            <p>
              Nice run! Keep going to
              beat your record.
            </p>

            <div className="final-score">
              <span>Score</span>
              <strong>{score}</strong>
            </div>

            <div className="reward-row">
              <span>
                {EMOJI.coin} +
                {coinsCollected}
              </span>

              <span>
                {EMOJI.specialCoin} +
                {specialCoinsCollected}
              </span>

              <span>
                {EMOJI.diamond} +
                {diamondsCollected}
              </span>
            </div>

            <div className="best-score">
              <Trophy size={17} />
              Best: {highScore}
            </div>

            <button
              className="primary-game-button"
              onClick={resetGame}
            >
              <RotateCcw size={18} />
              Play Again
            </button>

            <button
              className="secondary-game-button"
              onClick={returnToMenu}
            >
              <ArrowLeft size={18} />
              Main Menu
            </button>
          </div>
        </div>
      )}

      {running && !paused && (
        <>
          <div className="game-controls">
            <span>
              <b>SPACE</b> / ↑ Jump
            </span>

            <span>
              <b>↓</b> Duck
            </span>

            <span>
              <b>ESC</b> Pause
            </span>
          </div>

          <div className="mobile-half-controls">
            <div className="mobile-jump-zone">
              TAP TO JUMP
            </div>

            <div className="mobile-duck-zone">
              HOLD TO DUCK
            </div>
          </div>
        </>
      )}
    </section>
  );
}