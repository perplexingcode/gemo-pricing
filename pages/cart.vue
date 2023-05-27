<template>
    <div>
        <!-- Other content of your main component -->
        <cart></cart>
    </div>
</template>

<script>
    import { ref, computed, watch } from 'vue';
    import { v4 as uuidv4 } from 'uuid';
    // CART (CURRENT ITEM. BUILDING ITEM, VALIDATION, ADD ITEM)
    const currentItem = ref({ type: '' });

    // Building item
    const step = ref(1);

    const nextStep = () => {
        if (!currentItem.value.type) return;
        if (step.value === 2) return;
        step.value++;
    };
    const backStep = () => {
        if (step.value === 1) return;
        step.value--;
    };

    const resetOptions = () => {
        const radios = document.querySelectorAll('input[type="radio"]');
        radios.forEach((radio) => {
            radio.checked = false;
        });
    };

    // Step 1: Select item
    const selectItem = (item) => {
        if (currentItem.value.key === item.key) {
            step.value = 2;
            return;
        }
        resetOptions();
        currentItem.value = item;

        // Default values
        if (item.type === 'drink') {
            currentItem.value.options = {
                ...currentItem.value.options,
                ...drinkOptions,
            };
            currentItem.value.addons = {
                ...currentItem.value.addons,
                ...drinkAddons,
            };
        }
        if (item.type === 'food') {
            currentItem.value.options = {
                ...currentItem.value.options,
                ...foodOptions,
            };
            currentItem.value.addons = {
                ...currentItem.value.addons,
                ...foodAddons,
            };
        }

        // Inintialize states
        for (const key in currentItem.value.options) {
            for (const value of currentItem.value.options[key].values) {
                value.selected = false;
            }
        }
        currentItem.value.price = computed(() => {
            function calculateMarkup(options, addons) {
                let markup = 0;

                // Loop through each option
                for (const option in options) {
                    // Loop through each value within option
                    for (const valueKey in options[option].values) {
                        const value = options[option].values[valueKey];
                        // Check if the value is selected
                        if (value.selected) {
                            markup += value.price;
                        }
                    }
                }

                // Loop through each addon
                for (const addon in addons) {
                    markup += currentItem.value.addons[addon].price;
                }

                return markup;
            }
            return (
                currentItem.value.basePrice +
                JSON.parse(
                    JSON.stringify(
                        calculateMarkup(currentItem.value.options, currentItem.value.addons)
                    )
                )
            );
        });
        step.value = 2;
    };

    const optionsSelected = ref(false); // Initialize with a default value
    watch(
        () => {
            const options = currentItem.value.options;
            for (const optionKey in options) {
                const option = options[optionKey];
                const selectedValues = option.values.filter((value) => value.selected);

                if (selectedValues.length === 0) {
                    optionsSelected.value = false; // At least one option does not have a selected value
                    return;
                }
            }

            optionsSelected.value = true; // All options have at least one selected value
        },
        { immediate: true }
    );

    const addItem = () => {
        if (!optionsSelected.value) return;
        let description = '';
        {
            // Make description
            const item = currentItem.value;
            description += item.name + ' | ';
            const options = [];
            // Read options
            for (const optionKey in item.options) {
                const option = item.options[optionKey];
                const selectedValues = option.values.filter((value) => value.selected);
                if (selectedValues.length > 0) {
                    const optionKey = option.name;
                    let optionValue = '';
                    for (let i = 0; i < selectedValues.length; i++) {
                        const selectedValue = selectedValues[i];
                        optionValue = selectedValue.name;
                    }
                    options.push(optionKey + ': ' + optionValue);
                }
            }
            // Read addons
            for (const addonKey in item.addons) {
                const addon = item.addons[addonKey];
                if (addon.quantity > 0) {
                    options.push(addon.name + ' x' + addon.quantity);
                }
            }
            description += options.join(', ');
        }
        const newItem = {
            id: v4(),
            name: currentItem.value.name,
            price: currentItem.value.price,
            options: currentItem.value.options,
            addons: currentItem.value.addons,
            description: description,
        };
        session.order.items.push(newItem);
        // Reset currentItem
        currentItem.value = { type: '' };
        step.value = 1;
    };

    // Validation
    const computedCurrentItem = computed(() => {
        return JSON.parse(JSON.stringify(currentItem.value));
    });
    watch(
        computedCurrentItem,
        (newValue, oldValue) => {
            // L size is only available for cold and blended drinks
            if (newValue?.type === 'drink') {
                if (newValue.options.size.values[2].selected == true) {
                    currentItem.value.options.type.values[0].disabled = true;
                    currentItem.value.options.type.values[0].selected = false;
                    currentItem.value.options.type.values[0].tooltip =
                        'L size is only available for cold and blended drinks';
                } else {
                    currentItem.value.options.type.values[0].disabled = false;
                }
            }
            //
        },
        {
            deep: true,
        }
    );

    // Step 2: Select options
    const selectOption = (option, value) => {
        // Reset all values
        option.values.forEach((value) => (value.selected = false));
        const radios = document.querySelectorAll(
            '.option-radios' + '.' + option.key + ' input'
        );

        radios.forEach((radio) => {
            radio.checked = false;
        });

        // Select value
        value.selected = true;
        const radio = document.querySelector('.option' + '.' + value.key + ' input');
        radio.checked = true;
    };
</script>
