<template></template>
<script setup>
const drinks = {
  coffee: {
    name: 'Coffee',
    basePrice: 2,
    options: {
      type: {
        name: 'Type',
        values: [
          { name: 'Hot', price: 0 },
          { name: 'Cold', price: 0 },
          { name: 'Blended', price: 1 },
        ],
      },
    },
  },
};
</script>
<style></style>

<!-- <script>
const orderItem = {
  drinkType: '',
  size: '',
  cream: '',
  pumps: '',
  breakFast: '',
  foodOption: '',
};

// Final price = base price + markups + tax
const finalPrice = '';

//  Options
const drinkTypes = ['Hot', 'Cold', 'Blended'];
const sizes = ['S', 'M', 'L'];
const creams = ['WithCream', 'WithoutCream'];

// Base prices
const basePrices = {
  Hot: 2,
  Cold: 2,
  Blended: 2,
};

// Markups
const sizeMarkups = {
  S: 0,
  M: 0.5,
  L: 1,
};

const drinkTypeMarkups = {
  Hot: 0,
  Cold: 0,
  Blended: 1,
};

const creamMarkups = {
  WithCream: 0.5,
  WithoutCream: 0,
};

function calculatePrice1(drinkType, size, whippedCream) {
  // Exceptions
  if (size === 'L' && drinkType === 'Hot') {
    alert('Large size is only available for cold and blended drinks.');
  }

  if (drinkTypes.indexOf(drinkType) === -1) return;

  if (sizes.indexOf(size) === -1 || creams.indexOf(whippedCream) === -1) {
    alert('Invalid input, please double check your order.');
  }

  price += sizeMarkups[size];
  price += creamMarkups[whippedCream];
  price += drinkTypeMarkups[drinkType];

  return price;
}

function calculatePrice2() {
  sizes.push('XL');
  sizeMarkups.XL = 1.5;

  drinkTypes.push('MilkTea');
  basePrices.MilkTea = 2.25;

  var milk = ['Whole', 'Almond'];
  var milkMarkups = {
    Whole: 0,
    Almond: 0.5,
  };
}

function calculatePrice3(drinkType, pumps) {
  if (pumps > 6) {
    alert('Maximum 6 pumps of chocolate sauce.');
  }
  if (pumps < 0) {
    alert('Pumps cannot be negative.');
  }
  if (drinkType === 'Hot' && pumps > 2) {
    finalPrice += 0.5 * (pumps - 2);
  }
}

function calculatePrice4() {
  var breakFasts = ['Sandwich', 'Bagel'];
  basePrices.Sandwich = 3;
  basePrices.Bagel = 3;

  var foodOptions = ['Egg', 'Turkey', 'Butter', 'CreamCheese'];
  var foodOptionsMarkups = {
    Egg: 1,
    Turkey: 1,
    Butter: 0.5,
    CreamCheese: 0.5,
  };
}

function calculatePrice5(orderItems) {
  let invoice = '';
  for (let item of orderItems) {
    isDrink = item.drinkType ? true : false;
    invoice += (item.drinkType || item.breakFast) + '\n';
    let price = 0;

    price += basePrices[item.drinkType] ? basePrices[item.breakFast] : 0;
    invoice += 'Base price: ' + price + '\n';

    // Markups
    if (isDrink) {
      price += sizeMarkups[item.size];

      // Size
      sizeMarkups[item.size]
        ? (invoice += 'Size markup: ' + sizeMarkups[item.size] + '\n')
        : '';

      // Cream
      price += creamMarkups[item.cream];
      creamMarkups[item.cream]
        ? (invoice += 'Cream markup: ' + creamMarkups[item.cream] + '\n')
        : '';

      // Drink type
      price += drinkTypeMarkups[item.drinkType];
      drinkTypeMarkups[item.drinkType]
        ? (invoice +=
            'Drink type markup: ' + drinkTypeMarkups[item.drinkType] + '\n')
        : '';

      // Chocolate sauce pumps
      price += calculatePrice3(item.drinkType, item.pumps);
      calculatePrice3(item.drinkType, item.pumps)
        ? (invoice +=
            'Pumps markup: ' +
            calculatePrice3(item.drinkType, item.pumps) +
            '\n')
        : '';

      // Milk
      price += milkMarkups[item.milk];
      milkMarkups[item.milk]
        ? (invoice += 'Milk markup: ' + milkMarkups[item.milk] + '\n')
        : '';
    }

    if (!isDrink) {
      price += foodOptionsMarkups[item.foodOption];
      foodOptionsMarkups[item.foodOption]
        ? (invoice +=
            'Food option markup: ' + foodOptionsMarkups[item.foodOption] + '\n')
        : '';
    }
    price += price * 0.0725;
    invoice += 'Price: ' + price + '\n' + '\n' + '----------------';
  }
  return {
    invoice,
    price,
  };
}

</script> -->
