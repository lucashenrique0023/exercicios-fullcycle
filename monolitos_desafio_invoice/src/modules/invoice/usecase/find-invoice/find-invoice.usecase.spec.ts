import Address from "../../../@shared/domain/value-object/address.value-object"
import Invoice from "../../domain/invoice"
import InvoiceItem from "../../domain/invoice-item";
import FindInvoiceUseCase from "./find-invoice.usecase";

const item1 = new InvoiceItem({ name: "Item 1", price: 50 });
const item2 = new InvoiceItem({ name: "Item 2", price: 75 });

const address = new Address("123 Main St","45A","Apartment 2",
    "Cityville","Stateville","12345-678");

const invoice = new Invoice({
    name: "Invoice 1",
    document: "Document 1",
    address: address,
    items: [item1, item2]
})


const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice))
    };
};

describe("Find Invoice Usecase unit test", () => {
  it("should find a invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(invoice.name);
    expect(result.address).toStrictEqual(invoice.address.toObject());
    expect(result.createdAt).toEqual(invoice.createdAt);
  });
});
