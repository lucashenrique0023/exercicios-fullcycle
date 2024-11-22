import Product from "../../../domain/product/entity/product";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputListProductDto, OutputListProductDto } from "./list.product.dto";

export default class ListProductUseCase {
    private productRepository: ProductRepositoryInterface;

    constructor(productRepository: ProductRepositoryInterface) {
        this.productRepository = productRepository;
    }

    async execute(input: InputListProductDto): Promise<OutputListProductDto[]> {
        const products: Product[] = await this.productRepository.findAll();
        const output: OutputListProductDto[] = this.convertProductListToOutputList(products);
        return output;
    }

    convertProductListToOutputList(products: Product[]): OutputListProductDto[] {
        return products.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
        }));
    }
}