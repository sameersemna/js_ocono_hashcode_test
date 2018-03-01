function Slice(config) {
  this.count = config.count;
  this.cells = config.cells;
  this.getTotal = () => this.count.M + this.count.T;
  this.getCoordinates = () => {
    var coord = {};
    this.cells.forEach(cell => {
      coord = {
        tl: !coord.tl || (cell.r < coord.tl.r || cell.c < coord.tl.c) ? cell : coord.tl,
        tr: !coord.tr || (cell.r < coord.tl.r || cell.c > coord.tl.c) ? cell : coord.tr,
        bl: !coord.bl || (cell.r > coord.br.r || cell.c < coord.br.c) ? cell : coord.bl,
        br: !coord.br || (cell.r > coord.br.r || cell.c > coord.br.c) ? cell : coord.br,
      };
    });
    return coord;
  };
  this.getOuterCells = () => {
    var outerCells = [];
    this.cells.forEach(cell => {

    });
    return outerCells;
  };
  this.isCellSliceNeighbor = (cell) => {
    var slice = this;
    var isNeighbor = false;
    slice.cells.some((c) => {
      if ((cell.c === c.c) && (Math.abs(cell.r - c.r) === 1) ||
        ((cell.r === c.r) && (Math.abs(cell.c - c.c) === 1))) {
        isNeighbor = true;
        return true;
      }
    });
    return isNeighbor;
  };
  this.isCellContained = (cell) => {
    var selectedCells = this.cells.filter((c) => ((cell.c === c.c) && (cell.r === c.r)));
    return selectedCells.length > 0;
  };
  this.getNeighborCells = (cells) => {
    var neighborCells = [];
    cells.forEach(cell => {
      if(!this.isCellContained(cell) && this.isCellSliceNeighbor(cell) ){
        neighborCells.push(cell);
      }
    });
    return neighborCells;
  };
}

module.exports = Slice;
