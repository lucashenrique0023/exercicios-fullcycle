import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice-item";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
    
    async generate(invoice: Invoice): Promise<void> {
        await InvoiceModel.create(
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
    }
    
    async find(id: string): Promise<Invoice> {

        const invoiceModel = await InvoiceModel.findOne({ 
            where: { id },
            include: [
                {
                    model: InvoiceItemModel,
                    as: "items",
                },
            ],
        });

        if (!invoiceModel) {
            throw new Error("Invoice not found.");
        }

        const items = invoiceModel.items.map(
            (item) => new InvoiceItem({
                id: new Id(item.id),
                name: item.name,
                price: item.price,
            })
        );

        const address = new Address(invoiceModel.street, invoiceModel.number, invoiceModel.complement,
            invoiceModel.city, invoiceModel.state, invoiceModel.zipCode);

        return new Invoice({
            name: invoiceModel.name,
            document: invoiceModel.document,
            address: address,
            items,
            createdAt: invoiceModel.createdAt
        });
    }
    
}