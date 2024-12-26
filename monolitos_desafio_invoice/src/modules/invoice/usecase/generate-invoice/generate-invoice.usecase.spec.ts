import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn(),
  };
};

describe("Generate Invoice Usecase unit test", () => {
  it("should generate a invoice", async () => {
    const repository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(repository);

    const input = {
        name: "John Doe",
        document: "12345678901",
        street: "Main Street",
        number: "123",
        complement: "Apartment 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        items: [
          {
            id: "item1",
            name: "Product A",
            price: 25.99,
          },
          {
            id: "item2",
            name: "Product B",
            price: 15.49,
          },
          {
            id: "item3",
            name: "Product C",
            price: 45.00,
          },
        ],
      };

    const result = await usecase.execute(input);

    expect(repository.generate).toHaveBeenCalled();
    expect(result.name).toEqual(input.name);
    expect(result.document).toEqual(input.document);
    expect(result.street).toEqual(input.street);
    expect(result.number).toEqual(input.number);
    expect(result.complement).toEqual(input.complement);
    expect(result.city).toEqual(input.city);
    expect(result.state).toEqual(input.state);
    expect(result.zipCode).toEqual(input.zipCode);

    expect(result.items.length).toEqual(input.items.length);
    result.items.forEach((item, index) => {
    expect(item.id).toEqual(input.items[index].id);
    expect(item.name).toEqual(input.items[index].name);
    expect(item.price).toEqual(input.items[index].price);
});
  });
});
