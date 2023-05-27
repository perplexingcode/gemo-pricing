<template>
    <div>
        <!-- Other content of your main component -->
        <order></order>
    </div>

 <script>
</template>
 // ORDER
    const tax = 0.0725;
    const orderBackend = computed(() => {
        if (session.order.items.length === 0) {
            return {};
        }
        return {
            id: session.id,
            description: session.order.description,
            customer: session.customer,
            table: session.table,
            price: session.order.price,
            status: session.status,
        };
    });

    async function getOrderStatus() {
        // Expect: orderId and status from cashier side

        const response = await fetch(apiUrl + '/get/' + lockerOrder);
        const order = await response.json();
        if (development.value) console.log(order);
        if (order.status === 'Processing' && session.status !== 'Processing') {
            notifications.value.push(lang('orderProcessing'));
            session.status = 'Processing';
            console.log(session.status);
        }
        if (order.status === 'Done' && session.status !== 'Done') {
            notifications.value.push(lang('orderCompleted'));
            session.status = 'Done';
        }
    }

    setInterval(function () {
        if (testVar.value < 10) {
            getOrderStatus();
            if (development.value) {
                testVar.value++;
            }
        }
    }, 2000);

    function updateOrder() {
        fetch(apiUrl + '/upsert/' + lockerOrder, {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(orderBackend.value),
        });
    }

    const placeOrder = function () {
        if (session.order.items.length === 0) return;
        session.status = 'Received';
        // Add GMT+7 timestamp to order format yyyy-mm-dd hh:mm:ss
        orderBackend.value.timeStamp = new Date(
            new Date().getTime() + 7 * 60 * 60 * 1000
        )
            .toISOString()
            .substring(11, 19);
        updateOrder();
        notifications.value.push(lang('orderPlaced'));
    };

    function cancelOrder() {
        session.status = 'Cancelled';
        updateOrder();
        notifications.value.push(lang('orderCancelled'));
    }

    const newOrder = function () {
        session.id = v4();
        console.log(session.status !== 'Cancelled');
        if (session.status !== 'Cancelled') {
            session.order.items = [];
        }
        session.status = 'Ordering';
        updateOrder();
    };
</script>