import CreateProductUseCase from "./create.product.usecase";

const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
  };

describe("Unit test create product use case", () => {
  it("should create a product", async () => {
    const input = {
        name: "Product 1",
        price: 10.00,
    };

    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    const output = await createProductUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
  });

  it("should thrown an error when name is missing", async () => {
    const input = {
        name: "Product 1",
        price: 10.00,
    };

    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    input.name = "";

    await expect(createProductUseCase.execute(input)).rejects.toThrow(
      "Name is required"
    );
  });

  it("should thrown an error when price less than zero", async () => {
    const input = {
        name: "Product 1",
        price: 10.00,
    };
    
    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    input.price = -1;

    await expect(createProductUseCase.execute(input)).rejects.toThrow(
      "Price must be greater than zero"
    );
  });
});

