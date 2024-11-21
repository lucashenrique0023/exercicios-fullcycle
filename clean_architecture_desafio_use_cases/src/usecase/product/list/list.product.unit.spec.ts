import { v4 as uuid } from "uuid";
import Product from "../../../domain/product/entity/product";
import { OutputListProductDto } from "./list.product.dto";
import ListProductUseCase from "./list.product.usecase";

const product1 = new Product(uuid(), "Product 1", 10.00);
const product2 = new Product(uuid(), "Product 2", 20.00);
  
const MockRepository = () => {
return {
    create: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
};
};

describe("Unit test for listing product use case", () => {
it("should list a product", async () => {
    const repository = MockRepository();
    const useCase = new ListProductUseCase(repository);

    const outputListProductDto: OutputListProductDto[] = await useCase.execute({});

    expect(outputListProductDto.length).toBe(2);
    expect(outputListProductDto[0].id).toBe(product1.id);
    expect(outputListProductDto[0].name).toBe(product1.name);
    expect(outputListProductDto[0].price).toBe(product1.price);
    expect(outputListProductDto[1].id).toBe(product2.id);
    expect(outputListProductDto[1].name).toBe(product2.name);
    expect(outputListProductDto[1].price).toBe(product2.price);
});
});