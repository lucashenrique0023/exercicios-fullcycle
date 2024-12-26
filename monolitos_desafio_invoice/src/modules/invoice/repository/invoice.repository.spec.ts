import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import { InvoiceItemModel } from "./invoice-item.model";
import Invoice from "../domain/invoice";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/invoice-item";
import Address from "../../@shared/domain/value-object/address.value-object";
import InvoiceRepository from "./invoice.repository";

describe("InvoiceRepository test", () => {
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

  
  it("should create a invoice", async () => {
    const item1 = new InvoiceItem({ name: "Item 1", price: 50 });
    const item2 = new InvoiceItem({ name: "Item 2", price: 75 });
    
    const address = new Address("123 Main St","45A","Apartment 2",
        "Cityville","Stateville","12345-678");
    
    const invoice = new Invoice({
        id: new Id("1"),
        name: "Invoice 1",
        document: "Document 1",
        address: address,
        items: [item1, item2]
    });

    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    const invoiceDb = await InvoiceModel.findOne({ where: { id: "1" } });

    expect(invoiceDb.id).toBeDefined();
    expect(invoiceDb.name).toBe(invoice.name);
    expect(invoiceDb.document).toBe(invoice.document);
    expect(invoiceDb.street).toStrictEqual(invoice.address.street);
    expect(invoiceDb.number).toStrictEqual(invoice.address.number);
    expect(invoiceDb.complement).toStrictEqual(invoice.address.complement);
    expect(invoiceDb.city).toStrictEqual(invoice.address.city);
    expect(invoiceDb.state).toStrictEqual(invoice.address.state);
    expect(invoiceDb.zipCode).toStrictEqual(invoice.address.zipCode);
    expect(invoiceDb.createdAt).toStrictEqual(invoice.createdAt);
  });

  it("should find a invoice", async () => {
    const item1 = new InvoiceItem({ name: "Item 1", price: 50 });
    const item2 = new InvoiceItem({ name: "Item 2", price: 75 });
    
    const address = new Address("123 Main St","45A","Apartment 2",
        "Cityville","Stateville","12345-678");
    
    const date = new Date();
    const invoice = new Invoice({
        id: new Id("1"),
        name: "Invoice 1",
        document: "Document 1",
        address: address,
        items: [item1, item2],
        createdAt: date,
    });

    InvoiceModel.create(
      {
          id: invoice.id.id,
          name: invoice.name,
          document: invoice.document,
          createdAt: invoice.createdAt,
          updatedAt: invoice.updatedAt,
          street: invoice.address.street,
          number: invoice.address.number,
          complement: invoice.address.complement,
          city: invoice.address.city,
          state: invoice.address.state,
          zipCode: invoice.address.zipCode,
          items: invoice.items.map((item) => ({
              id: item.id.id,
              name: item.name,
              price: item.price,
          })),
      },
      {
          include: [
              { model: InvoiceItemModel, as: "items" },
          ],
      }
  );

    const repository = new InvoiceRepository();
    const invoiceDb = await repository.find(invoice.id.id);

    expect(invoiceDb.id).toBeDefined();
    expect(invoiceDb.name).toBe(invoice.name);
    expect(invoiceDb.document).toBe(invoice.document);
    expect(invoiceDb.address.street).toStrictEqual(invoice.address.street);
    expect(invoiceDb.address.number).toStrictEqual(invoice.address.number);
    expect(invoiceDb.address.complement).toStrictEqual(invoice.address.complement);
    expect(invoiceDb.address.city).toStrictEqual(invoice.address.city);
    expect(invoiceDb.address.state).toStrictEqual(invoice.address.state);
    expect(invoiceDb.address.zipCode).toStrictEqual(invoice.address.zipCode);
    expect(invoiceDb.createdAt).toStrictEqual(invoice.createdAt);
  });
});
