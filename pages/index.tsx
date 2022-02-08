/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CodeBlock, Layouts } from "@template/components";
import React, { useEffect, useMemo, useState } from "react";

const Board: React.FC<{ board: Board }> = ({ board }) => {
  const squares = useMemo(() => board.flat(), [board]);

  return (
    <div
      className="bg-blue-50"
      style={{ width: board.length * 30, height: board.length * 30, position: "relative" }}
    >
      {squares.map((square) => (
        <div
          key={`${square.x},${square.y}`}
          style={{
            height: 30,
            width: 30,
            backgroundColor: (square.y % 2 ? square.x % 2 : !(square.x % 2)) ? "#aaa" : "#eee",
            border: "1px solid gray",
            position: "absolute",
            bottom: square.y * 30,
            left: square.x * 30,
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {square.hasQueen ? <p>Q</p> : null}
        </div>
      ))}
    </div>
  );
};

const HomePage: React.FC = () => {
  const [numQueens, setNumQueens] = useState(5);
  const { solutionBoards, deltaTime } = useMemo(() => {
    const startTime = Date.now();
    const solutionBoards = determineNQueensSolutions(numQueens);
    const endTime = Date.now();
    const deltaTime = endTime - startTime;
    return {
      solutionBoards,
      startTime,
      endTime,
      deltaTime,
    };
  }, [numQueens]);

  return (
    <Layouts.Basic>
      <h1 className="mt-4 mb-4 text-2xl">N Queens Solver</h1>

      <div className="mb-4">
        <label htmlFor="numQueens" className="block text-sm font-medium text-gray-700">
          Number of Queens (1 - 9)
        </label>
        <div className="mt-1">
          <input
            defaultValue={numQueens}
            onChange={(e) => {
              // between 1 and 9
              setNumQueens(Math.min(Math.max(parseInt(e.target.value, 10) || 1, 1), 9));
            }}
            min={1}
            max={9}
            type="number"
            id="numQueens"
            className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block sm:text-sm border-gray-300 rounded-md"
            placeholder="5"
          />
        </div>
      </div>

      <h2 className="text-2xl">
        Solutions for {numQueens} {numQueens === 1 ? "Queen" : "Queens"}:
      </h2>
      <p>
        {solutionBoards.length} solutions total. Took {deltaTime / 1000} seconds to compute.
      </p>

      <div className="flex flex-1 flex-row flex-wrap w-full">
        {solutionBoards.map((board, i) => (
          <div className="p-4" key={`${i}`}>
            <Board board={board} />
          </div>
        ))}
      </div>
    </Layouts.Basic>
  );
};

type Square = Coord & { hasQueen: boolean };
type Board = Square[][];
type Coord = { x: number; y: number };

/**
 * this will return if a queen can be placed on the given position on this board.
 */
function isPositionValid(position: Coord, board: Board): boolean {
  return isPositionValidAsRook(position, board) && isPositionValidAsBishop(position, board);
}

function isPositionValidAsBishop(position: Coord, board: Board): boolean {
  return !board
    .flat()
    .filter((s) => s.hasQueen)
    .find((s) => {
      const xDiff = Math.abs(s.x - position.x);
      const yDiff = Math.abs(s.y - position.y);
      return xDiff === yDiff;
    });
}

function isPositionValidAsRook(position: Coord, board: Board): boolean {
  return !board
    .flat()
    .filter((s) => s.hasQueen)
    .find((s) => s.x === position.x || s.y === position.y);
}

function compareCoordinates(c1: Coord, c2: Coord): number {
  return c1.x - c2.x;
}

/**
 * given a board (with or without existing queens on it),
 * determine which new coordinates *could* have a queen on it.
 */
function determineCandidatePositions(board: Board): Coord[] {
  const lastQueenPlaced = determineLastQueenPlaced(board);
  const nextRowPositions: Coord[] = board.flat().filter((coord) => {
    if (lastQueenPlaced === null) return true; // If no queens placed, all squares are viable.
    return compareCoordinates(coord, lastQueenPlaced) === -1;
  });

  const candidatePositions = nextRowPositions.filter((p) => isPositionValid(p, board));
  return candidatePositions;
}

function determineLastQueenPlaced(board: Board): Coord | null {
  const allSquares = board.flat();
  const allQueens = allSquares.filter((s) => s.hasQueen);
  if (allQueens.length === 0) return null;

  const sortedQueens = allQueens.sort(compareCoordinates);

  const lastQueen = sortedQueens[0];
  if (!lastQueen) throw new Error("allQueens.length !== 0, but no sortedQueens[0] was found.");

  return lastQueen;
}

/**
 * Given an intermediate board state, return all children solutions
 */
function getSolutions(currentBoard: Board): Board[] {
  const candidates = determineCandidatePositions(currentBoard);

  const solutionBoards: Board[] = candidates
    .map((coordinate) => {
      const newBoard = addQueen(currentBoard, coordinate);
      return getSolutions(newBoard);
    })
    .flat();

  return [currentBoard, ...solutionBoards];
}

function addQueen(board: Board, coord: Coord): Board {
  const newBoard = cloneBoard(board);
  // @ts-expect-error we'll trust this array access.
  const square = newBoard[coord.x][coord.y];
  if (!square) throw new Error(`Square not found for coord: ${JSON.stringify(coord)}`);
  if (square.x !== coord.x || square.y !== coord.y) {
    throw new Error("Jacob, you messed up the row <-> col order");
  }
  // @ts-expect-error we'll trust this array access, also.
  newBoard[coord.x][coord.y].hasQueen = true;
  return newBoard;
}

function determineNQueensSolutions(n: number) {
  const emptyBoard: Board = makeBoard(n);
  return getSolutions(emptyBoard).filter(
    // (b) => true
    (board) => board.flat().filter((s) => s.hasQueen).length === n
  );
}

function cloneBoard(board: Board) {
  return board.map((row) => row.map((square) => ({ ...square })));
}

function makeBoard(n: number): Board {
  const board = new Array<Square[]>(n);
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      if (!board[x]) {
        board[x] = new Array<Square>(n);
      }
      const column = board[x];
      if (!column) throw new Error("Column not found for board.");
      column[y] = {
        x,
        y,
        hasQueen: false,
      };
    }
  }

  return board;
}

export default HomePage;
