var Slice = require('./Slice');

function Pizza(config) {
  this.settings = config.settings;
  this.cells = config.arr;
  this.cellsUnalloted = [];
  this.cellsAlloted = [];
  this.slices = [];
  this.ingredients = ['M', 'T'];
  this.ingredientCount = {};
  this.getIngredientCount = () => {
    this.cells.forEach((r, ri) => { // loop rows
      r.forEach((c, ci) => { // loop columns
        if (this.ingredientCount[c]) {
          this.ingredientCount[c]++;
        } else {
          this.ingredientCount[c] = 1;
        }
      });
    });
  };
  this.getIngredientCount();
  this.leastIngredient = this.ingredientCount.M < this.ingredientCount.T ? 'M' : 'T';
  this.minSlicesPossible = this.ingredientCount[this.leastIngredient];

  this.isCellAlloted = (cell) => {
    var cellAlloted = this.cellsAlloted.filter((c) => {
      return c.r === cell.r && c.c === cell.i
    });
    return cellAlloted.length > 0
  };
  this.allotCell = (cell) => {
    this.cellsUnalloted = this.cellsUnalloted.filter(uc => uc !== cell);
    this.cellsAlloted.push(cell);
  };

  this.shouldAddCellToSlice = (slice, cell, ing) => {
    // console.dir(JSON.stringify(cell));
    var currentCount = slice.getTotal();
    var nextCount = currentCount + 1;
    //console.log(this.settings.cps, this.settings.ips, slice.count.M, slice.count.T);

    // 6 >= 5 + (0-1) + (4-1)
    //if ((this.settings.cps >= countTotal + (slice.count.M - this.settings.ips) + (slice.count.T - this.settings.ips))) { // if slice conditions are not satisfied for max cells
    var cpsMaxCheck = this.settings.cps >= nextCount;
    // console.log(cpsMaxCheck, this.settings.cps, nextCount);
    var ipsMinCheck = false;
    if (ing === 'M') {
      ipsMinCheck = ing === this.leastIngredient ? slice.count.M < this.settings.ips : slice.count.T >= this.settings.ips;
    } else if (ing === 'T') {
      ipsMinCheck = ing === this.leastIngredient ? slice.count.T < this.settings.ips : slice.count.M >= this.settings.ips;
    }
    /*
    console.log(ing, cpsMaxCheck && ipsMinCheck);
    console.dir(cell);
    console.log('\n');
    */
    return cpsMaxCheck && ipsMinCheck;
  };

  this.addSlice = (firstCell, c) => {
    var slice = new Slice({
      count: {
        M: c == 'M' ? 1 : 0,
        T: c == 'T' ? 1 : 0,
      },
      cells: [firstCell],
    });
    this.slices.push(slice);
    this.allotCell(firstCell);
  };

  this.updateSlice = (nextCell, c, slice, sliceId) => {
    var updatedSlice = new Slice({
      count: {
        M: c === 'M' ? slice.count.M + 1 : slice.count.M,
        T: c === 'T' ? slice.count.T + 1 : slice.count.T,
      },
      cells: slice.cells.concat([nextCell]),
    });
    this.slices[sliceId] = updatedSlice;
    this.allotCell(nextCell);
  };

  this.allotUnalloted = () => {
    this.cellsUnalloted.forEach((currentCell) => {
      var c = currentCell.ing;
      this.slices.some((slice, sliceId) => {
        if (this.shouldAddCellToSlice(slice, currentCell, c) && slice.isCellSliceNeighbor(currentCell)) {
          this.updateSlice(currentCell, c, slice, sliceId);
          return true;
        }
      });
    });
    console.log(this.cellsUnalloted.length);
    if (this.cellsUnalloted.length > 1) {
      this.allotUnalloted();
    } else {
      console.dir(this.cellsUnalloted[0]);
    }
  };

  this.allotCellSlices = () => {
    this.slices.some((slice, sliceId) => {
      slice.getNeighborCells(this.cellsUnalloted).some(currentCell => {
        var c = currentCell.ing;
        //console.log(currentCell)
        //console.log('----')
        if (this.shouldAddCellToSlice(slice, currentCell, c)) {
          //console.log(currentCell)
          //console.log('')
          this.updateSlice(currentCell, c, slice, sliceId);
          return true;
        }
      });
    });
    if (this.cellsUnalloted.length > 0) {
      this.allotCellSlices();
    }
  };

  this.SliceIt = () => {
    this.cells.forEach((r, ri) => { // loop rows
      r.forEach((c, ci) => { // loop columns
        var currentCell = {
          r: ri,
          c: ci,
          ing: c
        };
        if (!this.isCellAlloted(currentCell) && c === this.leastIngredient) {
          var incompleteSliceAvailable = false;

          this.slices.some((slice, sliceId) => {
            if (this.shouldAddCellToSlice(slice, currentCell, c)) {
              incompleteSliceAvailable = true;
              this.updateSlice(currentCell, c, slice, sliceId);
              return true;
            }
          });

          if (!incompleteSliceAvailable) {
            this.addSlice(currentCell, c);
          }
        } else {
          this.cellsUnalloted.push(currentCell);
        }
      });
    });

    //this.allotUnalloted();
    this.allotCellSlices();
    console.log('========================================');
    console.log('ingredientCount:', this.ingredientCount);
    console.log('cellsAlloted:', this.cellsAlloted.length);
    console.log('cellsUnalloted:', this.cellsUnalloted.length);
    console.log('slices.length:', this.slices.length);
    //console.dir(this.slices);
    //console.dir(JSON.stringify(this.slices));
  };
}

module.exports = Pizza;
