export type TCustomer = {
  customerId: string;
  customerName: string;
  customerSurname: string;
  customerVehicle: string;
  customerVehicleKM: number;
  customerPhone: string;
  customerVehicleNumber: string;
  isChecked: boolean;
};

export const folderName = (customer: TCustomer) => {
  return `${customer.customerName}-${customer.customerSurname}-${customer.customerVehicle}-${customer.customerVehicleKM}/`;
};
