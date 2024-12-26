import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { FindInvoiceOutputDTO } from "../usecase/find-invoice/find-invoice.usecase.dto";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDTO, FindInvoiceFacadeOutputDTO, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export interface UseCaseProps {
    findInvoiceUsecase: UseCaseInterface;
    generateInvoiceUsecase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
    private _findUsecase: UseCaseInterface;
    private _generateUsecase: UseCaseInterface;

    constructor(usecaseProps: UseCaseProps) {
        this._findUsecase = usecaseProps.findInvoiceUsecase;
        this._generateUsecase = usecaseProps.generateInvoiceUsecase;
    }

    async generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
        const result:GenerateInvoiceFacadeOutputDto = await this._generateUsecase.execute(input);
        
        return {
            id: result.id,
            name: result.name,
            document: result.document,
            street: result.street,
            number: result.number,
            complement: result.complement,
            city: result.city,
            state: result.state,
            zipCode: result.zipCode,
            items: result.items.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
            })),
            total: result.total,
          };
    }

    async find(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO> {
        const result:FindInvoiceOutputDTO = await this._findUsecase.execute(input);

        return {
            id: result.id,
            name: result.name,
            document: result.document,
            address: {
                street: result.address.street,
                number: result.address.number,
                complement: result.address.complement,
                city: result.address.city,
                state: result.address.state,
                zipCode: result.address.zipCode,
            },
            items: result.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
              })),
            total: result.total,
            createdAt: result.createdAt
        }
    }
}