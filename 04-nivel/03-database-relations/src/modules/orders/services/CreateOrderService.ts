import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found');
    }

    const productsFound = await this.productsRepository.findAllById(products);

    if (productsFound.length === 0) {
      throw new AppError('No products found');
    }

    const orderProductsIds = productsFound.map(prod => prod.id);

    const checkInexistentProducts = products.filter(
      prod => !orderProductsIds.includes(prod.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError('No products found');
    }

    const findProdsWithNoQuantity = products.filter(
      product =>
        productsFound.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );

    if (findProdsWithNoQuantity.length) {
      throw new AppError('Quantity no enough');
    }

    const serializedProducts = products.map(prod => ({
      product_id: prod.id,
      quantity: prod.quantity,
      price: productsFound.filter(p => p.id === prod.id)[0].price,
    }));

    const order = await this.ordersRepository.create({
      customer,
      products: serializedProducts,
    });

    const { order_products } = order;

    const orderedProductsQuantity = order_products.map(prod => ({
      id: prod.product_id,
      quantity:
        productsFound.filter(p => p.id === prod.product_id)[0].quantity -
        prod.quantity,
    }));

    await this.productsRepository.updateQuantity(orderedProductsQuantity);

    return order;
  }
}

export default CreateOrderService;
