export {};

const text = await Deno.readTextFile("input.txt");
const gridSize = 1;
const grid = new Array(gridSize)
  .fill("")
  .map(() => new Array(gridSize).fill(""));

const startPostion = {
  x: 0,
  y: grid.length - 1,
};

const currentPosition = {
  H: {
    ...startPostion,
  },

  T: {
    ...startPostion,
  },
};

const visited = new Set<string>();
const checkTouched = (x: number, y: number, xT: number, yT: number) => {
  const diagonal = Math.abs(x - xT) === Math.abs(y - yT);
  const horizontal = x === xT && Math.abs(y - yT) === 1;
  const vertical = y === yT && Math.abs(x - xT) === 1;
  const overlap = x === xT && y === yT;
  return diagonal || horizontal || vertical || overlap;
};

const move = (direction: string, count: number) => {
  if (count > 1) {
    for (let i = 0; i < count; i++) {
      move(direction, 1);
    }
    return;
  }
  visited.add(`${currentPosition.T.x},${currentPosition.T.y}`);
  const { x, y } = currentPosition.H;
  const { x: xT, y: yT } = currentPosition.T;

  switch (direction) {
    case "U": {
      currentPosition.H.y = y - count;

      const touched = checkTouched(
        currentPosition.H.x,
        currentPosition.H.y,
        currentPosition.T.x,
        currentPosition.T.y
      );
      if (!touched) {
        currentPosition.T.y = yT - count;

        if (currentPosition.T.x !== currentPosition.H.x) {
          currentPosition.T.x = currentPosition.H.x;
        }
      }
      break;
    }
    case "D": {
      currentPosition.H.y = y + count;
      const touched = checkTouched(
        currentPosition.H.x,
        currentPosition.H.y,
        currentPosition.T.x,
        currentPosition.T.y
      );
      if (!touched) {
        currentPosition.T.y = yT + count;
        if (currentPosition.T.x !== currentPosition.H.x) {
          currentPosition.T.x = currentPosition.H.x;
        }
      }

      break;
    }
    case "L": {
      currentPosition.H.x = x - count;
      const touched = checkTouched(
        currentPosition.H.x,
        currentPosition.H.y,
        currentPosition.T.x,
        currentPosition.T.y
      );
      if (!touched) {
        currentPosition.T.x = xT - count;
        if (currentPosition.T.y !== currentPosition.H.y) {
          currentPosition.T.y = currentPosition.H.y;
        }
      }

      break;
    }
    case "R": {
      currentPosition.H.x = x + count;
      const touched = checkTouched(
        currentPosition.H.x,
        currentPosition.H.y,
        currentPosition.T.x,
        currentPosition.T.y
      );
      if (!touched) {
        currentPosition.T.x = xT + count;

        if (currentPosition.T.y !== currentPosition.H.y) {
          currentPosition.T.y = currentPosition.H.y;
        }
      }

      break;
    }
  }
};

text.split("\n").map((line) => {
  const [direction, count] = line.split(" ");

  move(direction, +count);
});

//visualize
console.log({ visited, size: visited.size });
