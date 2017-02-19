var arr = [{ a: 7, b: 13 }, { a: 3, b: 7 }, { a: 1, b: 2 }, { a: 5, c: 6 }, { a: 5, c: 6 }];
var result = arr.reduce((accumulator, currentValue, currentIndex, array) => {
    console.log('res: accumulator:', accumulator, '| currentValue:', currentValue, '| currentIndex:', currentIndex, '| array:', array);
    accumulator[currentValue.a] = currentValue;
    return accumulator;
});

console.log("\n * \
             \n ** \
             \n **** \
             \n ******** \
             \n **************** \
             \n ******************************** \
             \n **************************************************************** \
             \n ******************************************************************************************************************************** \
             ", result);
