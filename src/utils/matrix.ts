import { Event } from "../constants/data";

function compareEvents(eventA: Event, eventB: Event): number {
  if (eventA.startTime > eventB.startTime) return 1;
  if (eventA.startTime < eventB.startTime) return -1;
  return 0;
}

type Matrix = number[][];

class MatrixPosition {
  constructor(
    public x1: number,
    public y1: number,
    public x2: number,
    public y2: number
  ) {}

  addWidth(value: number = 1): void {
    this.x2 += value;
  }

  subWidth(value: number = 1): void {
    this.x2 -= value;
  }

  addX(value: number = 1): void {
    this.x1 += value;
    this.x2 += value;
  }

  setX(value: number): void {
    this.x2 -= this.x1 - value;
    this.x1 = value;
  }

  subX(value: number = 1): void {
    this.x1 -= value;
    this.x2 -= value;
  }

  getWidth(): number {
    return this.x2 - this.x1;
  }

  copy(): MatrixPosition {
    return new MatrixPosition(this.x1, this.y1, this.x2, this.y2);
  }
}

class PositionsMatrix {
  constructor(
    public matrixHeight: number,
    public matrixWidth: number = 1,
    public map: Record<number, MatrixPosition> = {},
    private _matrix: Matrix = []
  ) {
    this._refreshMatrix();
  }

  get(key: number): MatrixPosition {
    return this.map[key];
  }

  delete(key: number): void {
    delete this.map[key];
    this._refreshMatrix();
  }

  set(key: number, position: MatrixPosition) {
    this.map[key] = position;
    this._refreshMatrix();
  }

  addWidth(value: number = 1) {
    this.matrixWidth += value;

    this._refreshMatrix();
  }

  _refreshMatrix() {
    const matrix: Matrix = Array.from({ length: this.matrixWidth }, () =>
      Array.from({ length: this.matrixHeight })
    );

    for (const [key, position] of Object.entries(this.map)) {
      for (let i = position.x1; i <= position.x2; i++) {
        for (let j = position.y1; j <= position.y2; j++) {
          matrix[i][j] = +key;
        }
      }
    }

    this._matrix = matrix;
  }

  _fillMatrix(value: string, position: MatrixPosition) {
    for (let i = position.x1; i <= position.x2; i++) {
      for (let j = position.y1; j <= position.y2; j++) {
        this._matrix[i][j] = +value;
      }
    }
  }

  getMatrix(): Matrix {
    return this._matrix;
  }

  getConflicts(position: MatrixPosition): number[] {
    const conflicts = [];
    const matrix: Matrix = this._matrix;

    for (let i = position.x1; i <= position.x2; i++) {
      for (let j = position.y1; j <= position.y2; j++) {
        if (!!matrix[i][j]) {
          conflicts.push(matrix[i][j]);
        }
      }
    }

    return Array.from([...new Set(conflicts)]);
  }

  hasConflicts(position: MatrixPosition): boolean {
    return this.getConflicts(position).length > 0;
  }

  getPosition(x: number, y: number): MatrixPosition | undefined {
    const key = this._matrix[x][y];
    return this.get(key);
  }

  longEvents() {
    if (this.matrixWidth === 1) {
      return;
    }

    for (let i = this.matrixWidth - 2; i >= 0; i--) {
      let keys: Record<number, true> = {};

      for (let j = 0; j < this.matrixHeight; j++) {
        if (!!this._matrix[i][j]) {
          keys[this._matrix[i][j]] = true;
        }
      }

      for (const key of Object.keys(keys)) {
        let position = this.get(+key);

        this.delete(+key);

        let testPosition = position.copy();

        testPosition.addWidth();

        while (
          testPosition.x2 < this.matrixWidth &&
          !this.hasConflicts(testPosition)
        ) {
          position = testPosition.copy();
          testPosition.addWidth();
        }

        this.set(+key, position);
      }
    }
  }
}

export default function getMatrixFromEvents(
  events: Event[],
  dailyBounds: [number, number],
  slotDuration: number
): PositionsMatrix {
  events.sort(compareEvents);

  const dailySlotsNumber = (dailyBounds[1] - dailyBounds[0]) / slotDuration;
  const positionsMatrix = new PositionsMatrix(dailySlotsNumber);

  for (const event of events) {
    const y1 = (event.startTime - dailyBounds[0]) / slotDuration;
    const y2 = (event.endTime - dailyBounds[0]) / slotDuration - 1;
    const x1 = 0;
    const x2 = 0;

    const position = new MatrixPosition(x1, y1, x2, y2);

    let conflicts = positionsMatrix.getConflicts(position);

    while (conflicts.length > 0 && position.x2 < positionsMatrix.matrixWidth) {
      position.addX();

      if (position.x2 < positionsMatrix.matrixWidth) {
        conflicts = positionsMatrix.getConflicts(position);
      }
    }

    if (position.x2 === positionsMatrix.matrixWidth) {
      positionsMatrix.addWidth();
    }

    positionsMatrix.set(event.id, position);
  }

  positionsMatrix.longEvents();

  return positionsMatrix;
}
