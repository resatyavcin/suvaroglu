import { create } from 'zustand';
import { TCustomer } from '@/constants';

interface ICustomerState {
  customerList: any[];
  filePath: string;
  fileName: string;
  deleteButtonText: string;
  selectedCustomersCount: number;
  selectedCustomers: string[] | null;
  selectCustomers: (customerId: string) => void;
  unselectCustomers: (customerId: string) => void;
  leaveSelectedCustomers: () => void;
  deleteCustomers: (customerIds: string[]) => void;

  isViewActionButtons: boolean;
  isOpenAlertDialogComponent: boolean;
  setIsOpenAlertDialogComponent: () => void;
  isSelectableCustomers: boolean;
  setIsSelectableCustomers: (param?: boolean) => void;
  setFilePath: (param?: string) => void;
  setFileName: (param?: string) => void;
  folders: { folderName: string; folderPath: string }[];
}

const useCustomerStore = create<ICustomerState>((set) => ({
  isOpenAlertDialogComponent: false,
  isViewActionButtons: false,
  customerList: [],
  deleteButtonText: 'Müşteriyi Sil',
  selectedCustomersCount: 0,
  selectedCustomers: [],
  isSelectableCustomers: false,
  filePath: '',
  fileName: '',
  folders: [
    {
      folderName: 'Hasar Evrakları',
      folderPath: '/crime-scene-documents',
    },
    {
      folderName: 'Ekspertiz Evrakları',
      folderPath: '/expertise-documents',
    },
    {
      folderName: 'Onarım Evrakları',
      folderPath: '/repair-documents',
    },
    {
      folderName: 'Kapanış Evrakları',
      folderPath: '/closing-documents',
    },
  ],

  setFilePath: (param?: string) =>
    set(() => {
      return {
        filePath: param,
      };
    }),

  setFileName: (param?: string) =>
    set(() => {
      return {
        fileName: param,
      };
    }),

  setIsSelectableCustomers: (param?: boolean) =>
    set((state: ICustomerState) => {
      return {
        isSelectableCustomers: param && !state.isSelectableCustomers,
      };
    }),

  setIsOpenAlertDialogComponent: () =>
    set((state: ICustomerState) => {
      return {
        isOpenAlertDialogComponent: !state.isOpenAlertDialogComponent,
      };
    }),

  selectCustomers: (customerId: string) =>
    set((state: ICustomerState) => {
      state.isViewActionButtons = true;

      const newCustomerList = [...(state.selectedCustomers || []), customerId];

      return {
        selectedCustomersCount: state.selectedCustomersCount + 1,
        selectedCustomers: newCustomerList,
      };
    }),

  unselectCustomers: (customerIdLocal: string) =>
    set((state: ICustomerState) => {
      if (state.selectedCustomersCount == 1) {
        state.isViewActionButtons = false;
      }

      return {
        selectedCustomersCount: state.selectedCustomersCount - 1,
        selectedCustomers: state.selectedCustomers?.filter(
          (customerId: string) => customerId !== customerIdLocal
        ),
      };
    }),

  leaveSelectedCustomers: () =>
    set((state: ICustomerState) => ({
      selectedCustomersCount: 0,
      selectedCustomers: [],
    })),

  deleteCustomers: (customerIds: string[]) =>
    set((state: ICustomerState) => {
      const newCustomerList = state.customerList?.filter(
        (customer: TCustomer) => {
          return customerIds.some(
            (customerId) => customerId !== customer.customerId
          );
        }
      );

      return {
        customerList: newCustomerList,
        selectedCustomers: [],
        isSelectableCustomers: false,
        isViewActionButtons: false,
      };
    }),
}));

export { useCustomerStore };
