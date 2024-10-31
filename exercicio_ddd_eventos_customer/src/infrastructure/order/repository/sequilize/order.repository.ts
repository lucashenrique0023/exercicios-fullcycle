import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total()
      },
      {
        where: { id: entity.id },
      }
    );

    const orderItems = entity.items.map((item) => ({
      id: item.id,
      order_id: entity.id,
      name: item.name,
      price: item.price,
      product_id: item.productId,
      quantity: item.quantity,
    }));

    await OrderItemModel.bulkCreate(orderItems, {
      updateOnDuplicate: ["name", "price", "product_id", "quantity"],
    });
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        include: ["items"],
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    const order = this.getOrderFromOrderModel(orderModel);

    return order;
  }

  async findAll(): Promise<Order[]> {
    const orders = await OrderModel.findAll({include: ["items"]});
    return orders.map((orderModel) => this.getOrderFromOrderModel(orderModel));
  }

  getOrderFromOrderModel(orderModel: OrderModel): Order {
    if (orderModel != null) {
      return new Order(
        orderModel.id,
        orderModel.customer_id,
        orderModel.items.map((orderItemModel) => {
          return new OrderItem(
            orderItemModel.id,
            orderItemModel.name,
            orderItemModel.price,
            orderItemModel.product_id,
            orderItemModel.quantity
        );
        }
      ));
    }
  } 

}