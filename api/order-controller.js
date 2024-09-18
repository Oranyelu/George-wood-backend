const createOrder = async (req, res) => {
    const { customerName, email, items } = req.body;
    const trackingId = generateTrackingId(); // Function to create unique tracking ID
  
    try {
      const newOrder = new Order({ customerName, email, items, trackingId });
      await newOrder.save();
      res.status(201).json({ message: 'Order created successfully', trackingId });
    } catch (error) {
      res.status(500).json({ message: 'Error creating order', error });
    }
  };

  const updateOrderStatus = async (req, res) => {
    const { trackingId } = req.params;
    const { status } = req.body;
  
    try {
      const updatedOrder = await Order.findOneAndUpdate(
        { trackingId },
        { status },
        { new: true }
      );
      if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json({ message: 'Order updated', updatedOrder });
    } catch (error) {
      res.status(500).json({ message: 'Error updating order', error });
    }
  };
  

  const getOrderByTrackingId = async (req, res) => {
    const { trackingId } = req.params;
  
    try {
      const order = await Order.findOne({ trackingId });
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching order', error });
    }
  };
  

  const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders', error });
    }
  };
  