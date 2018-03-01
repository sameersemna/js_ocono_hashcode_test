

function Pizza(config) {
  this.settings = config.settings;
  this.cells = config.arr;
  this.cellsAlloted = [];
  this.slices = [];
  this.ingredients = ['M', 'T'];
  this.ingredientCount = {};
  this.getIngredientCount = () => {
    this.cells.forEach((r, ri) => { // loop rows
      r.forEach((c, ci) => { // loop columns
        if(this.ingredientCount[c]){
          this.ingredientCount[c]++;
        }else{
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

this.shouldAddCellToSlice = (slice, cell, ing) => {
  console.dir(JSON.stringify(cell));
  var currentCount = slice.countM + slice.countT;
  var nextCount = currentCount + 1;
  //console.log(this.settings.cps, this.settings.ips, slice.countM, slice.countT);

  // 6 >= 5 + (0-1) + (4-1)
  //if ((this.settings.cps >= countTotal + (slice.countM - this.settings.ips) + (slice.countT - this.settings.ips))) { // if slice conditions are not satisfied for max cells
  var cpsMaxCheck = this.settings.cps >= nextCount;
  // console.log(cpsMaxCheck, this.settings.cps, nextCount);
  var ipsMinCheck = false;
  if(ing === 'M'){
    ipsMinCheck = ing === this.leastIngredient ? slice.countM < this.settings.ips : slice.countT >= this.settings.ips;
  }else if (ing === 'T') {
    ipsMinCheck = ing === this.leastIngredient ? slice.countT < this.settings.ips : slice.countM >= this.settings.ips;
    console.log(ing, ipsMinCheck);
  }
  console.log(ing, cpsMaxCheck && ipsMinCheck);
  console.log('\n');
  return cpsMaxCheck && ipsMinCheck;
};

  this.Slice = () => {
    this.cells.forEach((r, ri) => { // loop rows
      r.forEach((c, ci) => { // loop columns
        var currentCell = {r: ri, c: ci};
        if (!this.isCellAlloted(currentCell)) {
          //console.log(c, ri, ci);
          var incompleteSliceAvailable = false;
          //console.dir(this.slices);
          this.slices.some((slice, sliceId) => {
            if(this.shouldAddCellToSlice(slice, currentCell, c)){
              incompleteSliceAvailable = true;
              var updatedSlice = {
                countM: c === 'M' ? slice.countM + 1 : slice.countM,
                countT: c === 'T' ? slice.countT + 1 : slice.countT,
                cells: slice.cells.concat([currentCell]),
              };
              this.slices[sliceId] = updatedSlice;
              this.cellsAlloted.push(currentCell);
              return true;
            }
          });

          if (!incompleteSliceAvailable) {
            var slice = {
              countM: c == 'M' ? 1 : 0,
              countT: c == 'T' ? 1 : 0,
              cells: [currentCell],
            };
            this.slices.push(slice);
            this.cellsAlloted.push(currentCell);
          }
        }
      });
      //console.log('\n');
    });
    console.log(this.ingredientCount);
    console.log(this.cellsAlloted.length);
    console.log(this.slices.length);
    console.dir(JSON.stringify(this.slices));
  };
}

module.exports = Pizza;
