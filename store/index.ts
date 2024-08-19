import { create } from 'zustand'
import {TCustomer} from "@/constants";
import customerData from '@/customer.json'

interface ICustomerState {
    customerList: TCustomer[];
    deleteButtonText: string;
    selectedCustomersCount: number,
    selectedCustomers: string[] | null,
    selectCustomers: (customerId: string) => void,
    unselectCustomers: (customerId: string) => void,
    leaveSelectedCustomers: () => void,
    deleteCustomers: (customerIds: string[]) => void,

    isViewActionButtons: boolean;
    isOpenAlertDialogComponent: boolean;
    setIsOpenAlertDialogComponent: () => void;
    isSelectableCustomers: boolean;
    setIsSelectableCustomers: (param?: boolean) => void;

}

const useCustomerStore = create<ICustomerState>((set) => ({
    isOpenAlertDialogComponent: false,
    isViewActionButtons: false,
    customerList: customerData?.db,
    deleteButtonText: "Müşteriyi Sil",
    selectedCustomersCount: 0,
    selectedCustomers: [],
    isSelectableCustomers: false,
    setIsSelectableCustomers: (param?: boolean) => set((state: ICustomerState) => {
        return {
            isSelectableCustomers: param && !state.isSelectableCustomers,
        }
    }),


    setIsOpenAlertDialogComponent: () => set((state: ICustomerState) => {
        return {
            isOpenAlertDialogComponent: !state.isOpenAlertDialogComponent,
        }
    }),

    setSelectedCustomers: (param: boolean |undefined) => set((state: ICustomerState) => {
        return {}
    }),
    selectCustomers: (customerId: string) => set((state: ICustomerState) =>
    {
        state.isViewActionButtons = true;

        if(state.selectedCustomersCount > 0){
            state.deleteButtonText = "Müşterileri Sil"
        }
        const newCustomerList = state.customerList?.filter((customer: TCustomer) => customer.customerId == customerId)

        return {
            selectedCustomersCount: state.selectedCustomersCount + 1,
            selectedCustomers: [...state.selectedCustomers || [], ...newCustomerList?.map((customer: TCustomer) => customer.customerId) ],
        }
    }),

    unselectCustomers: (customerIdLocal: string) => set((state: ICustomerState) =>
    {

        if(state.selectedCustomersCount == 2){
            state.deleteButtonText = "Müşteriyi Sil"
        }

        if(state.selectedCustomersCount == 1){
            state.isViewActionButtons = false;
        }

        return {
            selectedCustomersCount: state.selectedCustomersCount - 1,
            selectedCustomers: state.selectedCustomers?.filter((customerId: string) => customerId !== customerIdLocal)
        }
    }),

    leaveSelectedCustomers: () => set((state:ICustomerState) =>
        ({
            selectedCustomersCount: 0,
            selectedCustomers: []
        })),

    deleteCustomers: (customerIds: string[]) => set((state:ICustomerState) => {

        const newCustomerList = state.customerList?.filter((customer: TCustomer) => {
            return customerIds.some(customerId => customerId !== customer.customerId)
        });

        return {
            customerList: newCustomerList,
            selectedCustomers: [],
            isSelectableCustomers: false,
            isViewActionButtons: false
        }
    })
}))

export {
    useCustomerStore,
}