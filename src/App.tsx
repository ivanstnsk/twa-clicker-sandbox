import { useEffect, useRef, useState } from "react";
import "./App.css";

type Coin = {
  value: number;
  time: number;
  x: number;
  y: number;
};

type Coins = {
  coins: Coin[];
};

const FPS = 60;
const FRAME_DURATION = 1000 / FPS;
let lastFrameTime = 0;

function App() {
  const [count, setCount] = useState(0);
  const [tap, setTap] = useState<number>(1);
  const coinsRef = useRef<Coins>({
    coins: [],
  });

  const update = (delta: number) => {
    const offset = delta * window.innerHeight * 0.001;
    coinsRef.current.coins.forEach((coin) => {
      coin.y -= offset;

      if (coin.y <= 0) {
        coinsRef.current.coins = coinsRef.current.coins.filter(
          (c) => c !== coin
        );
      }
    });
  };

  const draw = (currentTime: number) => {
    const elapsed = currentTime - lastFrameTime;

    if (elapsed >= FRAME_DURATION) {
      lastFrameTime = currentTime;
      update(elapsed);
    }

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      coinsRef.current.coins.forEach((coin) => {
        const sh = window.innerHeight / 2;
        const opacity = (1 / sh) * coin.y;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.font = "50px sans-serif";
        ctx.fillText(`${coin.value}`, coin.x, coin.y);
      });
    }

    requestAnimationFrame(draw);
  };

  useEffect(() => {
    requestAnimationFrame(draw);

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    const resize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    resize();

    addEventListener("resize", resize, true);

    return () => {
      removeEventListener("resize", resize, true);
    };
  }, []);

  const click = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(20);
    }
    const coin: Coin = {
      value: tap,
      time: Date.now(),
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 100,
      y: window.innerHeight / 2,
    };
    coinsRef.current.coins.push(coin);
    setCount(count + tap);
  };

  return (
    <section className="wrapper">
      <section className="head">
        <div className="coin small"></div>
        <div className="balans">
          {String(count).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
      </section>
      <section className="body">
        <button onClick={click} className="coin big">
          ₴
        </button>
      </section>
      <canvas id="canvas"></canvas>
    </section>
  );
}

export default App;
