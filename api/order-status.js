app.get('/api/order-status/:trackingId', async (req, res) => {
    const { trackingId } = req.params;

    try {
        await client.connect();
        const database = client.db('orderDB');
        const orders = database.collection('orders');

        const order = await orders.findOne({ trackingId });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ order });
    } catch (error) {
        console.error('Error fetching order status:', error);
        res.status(500).json({ message: 'There was an error processing your request.' });
    } finally {
        await client.close();
    }
});
