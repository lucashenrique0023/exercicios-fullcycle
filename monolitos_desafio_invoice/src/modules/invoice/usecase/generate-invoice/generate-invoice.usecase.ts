import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice-item";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceInputDto, GenerateInvoiceOutputDto } from "./generate-invoice.usecase.dto";

export default class GenerateInvoiceUseCase {

    private _invoiceRepository: InvoiceGateway;

    constructor(invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = invoiceRepository;
    }

    async execute(input: GenerateInvoiceInputDto): Promise<GenerateInvoiceOutputDto> {

        const address = new Address(
            input.street,
            input.number,
            input.complement,
            input.city,
            input.state,
            input.zipCode);

            const items = input.items.map(
                (item) => new InvoiceItem({ id: new Id(item.id), name: item.name, price: item.price })
            );

        const invoice = new Invoice({
            id: new Id(), 
            name: input.name,
            document: input.document,
            address: address,
            items: items
        })


        await this._invoiceRepository.generate(invoice);

        return {
            id: invoice.id.id,
            name: input.name,
            document: input.document,
            street: input.street,
            number: input.number,
            complement: input.complement,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode,
            items: input.items,
            total: invoice.total,
        }
    }
}