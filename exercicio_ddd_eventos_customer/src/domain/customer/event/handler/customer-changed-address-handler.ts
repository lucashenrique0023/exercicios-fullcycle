import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import Customer from "../../entity/customer";
import CustomerChangedAddressEvent from "../customer-changed-address.event";


export default class CustomerChangedAddressHandler
  implements EventHandlerInterface<CustomerChangedAddressEvent>
{
  handle(event: CustomerChangedAddressEvent): void {
    const customer: Customer = event.eventData;
    console.log(`Endereço do cliente: ${customer.id}, ${customer.name} alterado para: ${customer.address}`);
  }
}