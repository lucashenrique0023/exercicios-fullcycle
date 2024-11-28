import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import Product from "../../../domain/product/entity/product";
import { OutputListProductDto } from "./list.product.dto";

describe("Test find product use case", () => {
    let sequelize: Sequelize;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([ProductModel]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });
  
    it("should list products", async () => {
      const productRepository = new ProductRepository();
      const usecase = new ListProductUseCase(productRepository);
  
      const product1 = new Product("111", "Product 1", 10.00);
      await productRepository.create(product1);

      const product2 = new Product("222", "Product 2", 20.00);
      await productRepository.create(product2);

      const outputListProductDto: OutputListProductDto[] = await usecase.execute({});
  
    expect(outputListProductDto.length).toBe(2);
    expect(outputListProductDto[0].id).toBe(product1.id);
    expect(outputListProductDto[0].name).toBe(product1.name);
    expect(outputListProductDto[0].price).toBe(product1.price);
    expect(outputListProductDto[1].id).toBe(product2.id);
    expect(outputListProductDto[1].name).toBe(product2.name);
    expect(outputListProductDto[1].price).toBe(product2.price);
    });
});