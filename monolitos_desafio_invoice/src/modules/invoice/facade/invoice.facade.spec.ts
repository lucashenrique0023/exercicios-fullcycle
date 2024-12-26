import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice.model";
import { InvoiceItemModel } from "../repository/invoice-item.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate a invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

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

    await facade.generate(input);

    const result = await InvoiceModel.findOne({
        include: [{ model: InvoiceItemModel }]
    });

    expect(result).toBeDefined();
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
    })
  });


  it("should find a invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

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

    await facade.generate(input);

    const result = await InvoiceModel.findOne({
        include: [{ model: InvoiceItemModel }]
    });

    const resultFacade = await facade.find({ id: result.id });

    expect(resultFacade).toBeDefined();
    expect(resultFacade.name).toEqual(input.name);
    expect(resultFacade.document).toEqual(input.document);
    expect(resultFacade.address.street).toEqual(input.street);
    expect(resultFacade.address.number).toEqual(input.number);
    expect(resultFacade.address.complement).toEqual(input.complement);
    expect(resultFacade.address.city).toEqual(input.city);
    expect(resultFacade.address.state).toEqual(input.state);
    expect(resultFacade.address.zipCode).toEqual(input.zipCode);
    expect(resultFacade.items.length).toEqual(input.items.length);
    resultFacade.items.forEach((item, index) => {
    expect(item.id).toEqual(input.items[index].id);
    expect(item.name).toEqual(input.items[index].name);
    expect(item.price).toEqual(input.items[index].price);
    })
  });
});