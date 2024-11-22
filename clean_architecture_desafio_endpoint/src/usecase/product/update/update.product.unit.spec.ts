import { v4 as uuid } from "uuid";
import { InputUpdateProductDto, OutputUpdateProductDto } from "./update.product.dto";
import UpdateProductUseCase from "./update.product.usecase";
import Product from "../../../domain/product/entity/product";

const product: Product = new Product(uuid(), "Product Updated", 10.00,);

const input: InputUpdateProductDto = {
  id: product.id,
  name: "Product Updated",
  price: 10.00
};

const outputUpdateProductDto: OutputUpdateProductDto = {
    id: product.id,
    name: "Product Updated",
    price: 10.00
}

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    update: jest.fn(),
  };
};

describe("Unit test for product update use case", () => {
    it("should update a product", async () => {
    const productRepository = MockRepository();
    const updateProductUseCase = new UpdateProductUseCase(productRepository);

    const output: OutputUpdateProductDto = await updateProductUseCase.execute(input);

    expect(output).toEqual(outputUpdateProductDto);
    });
});
