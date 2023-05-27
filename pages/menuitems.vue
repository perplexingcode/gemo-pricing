<template>
    <div>
        <!-- Other content of your main component -->
        <menu-items></menu-items>
    </div>
</template>

<script>
    import { computed } from 'vue';

    export default {
        data() {
            return {
                items: {
                    coffee: {
                        name: 'Coffee',
                        key: 'coffee',
                        img: 'https://img.icons8.com/fluency/48/vietnamese-coffee.png',
                        type: 'drink',
                        basePrice: 2,
                        options: {},
                        addons: {},
                    },
                    milkTea: {
                        name: 'Milk Tea',
                        key: 'milkTea',
                        img: 'https://img.icons8.com/fluency/48/milkshake.png',
                        type: 'drink',
                        basePrice: 2.25,
                        options: {
                            milk: {
                                name: 'Milk',
                                key: 'milk',
                                values: [
                                    { name: 'Whole Milk', key: 'whole', price: 0 },
                                    { name: 'Almond Milk', key: 'almond', price: 0.5 },
                                ],
                            },
                        },
                        addons: {},
                    },
                    sandwich: {
                        name: 'Sandwich',
                        key: 'sandwich',
                        img: 'https://img.icons8.com/fluency/48/sandwich.png',
                        type: 'food',
                        basePrice: 3,
                        options: {
                            filling: {
                                name: 'Filling',
                                values: [
                                    { name: 'Egg', key: 'egg', price: 1 },
                                    { name: 'Turkey', key: 'turkey', price: 1 },
                                ],
                            },
                        },
                    },
                    bagel: {
                        name: 'Bagel',
                        key: 'bagel',
                        img: 'https://img.icons8.com/fluency/48/bagel.png',
                        type: 'food',
                        basePrice: 3,
                        options: {
                            spread: {
                                name: 'Spread',
                                values: [
                                    { name: 'Butter', key: 'butter', price: 0.5 },
                                    { name: 'Cream Cheese', key: 'creamCheese', price: 0.5 },
                                ],
                            },
                        },
                    },
                },
            };
        },
        computed: {
            drinks() {
                return Object.values(this.items).filter((item) => item.type === 'drink');
            },
            foods() {
                return Object.values(this.items).filter((item) => item.type === 'food');
            },
        },
    };
</script>
