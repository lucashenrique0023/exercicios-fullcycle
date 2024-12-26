import BaseEntity from "../../@shared/domain/entity/base.entity";
import InvoiceItem from "./invoice-item";
import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";

type InvoiceProps = {
    id?: Id,
    name: string;
    document: string,
    address: Address,
    items: InvoiceItem[],
    createdAt?: Date
}

export default class Invoice extends BaseEntity implements AggregateRoot {

    private _name: string;
    private _document: string;
    private _address: Address;
    private _items: InvoiceItem[];
    private _total: number;

    constructor(props: InvoiceProps) {
        super(props.id, props.createdAt);
        this._name = props.name;
        this._document = props.document;
        this._address = props.address;
        this._items = props.items;
        this.calculateTotal();
    }

    get name(): string {
        return this._name;
    }

    get document(): string {
        return this._document;
    }

    get address(): Address {
        return this._address;
    }

    get items(): InvoiceItem[] {
        return this._items;
    }

    get total(): number {
        return this._total;
    }

    calculateTotal() {
        this._total = this._items.reduce((acc, item) => acc + item.price, 0);
    }
 }