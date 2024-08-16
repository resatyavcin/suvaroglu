import { create } from 'zustand'
import {TCustomer} from "@/constants";
import customerData from '@/customer.json'

interface ICustomerState {
    customerList: TCustomer[];
    deleteButtonText: string;
    selectedCustomersCount: number,
    selectedCustomers: TCustomer[] | null,
    selectCustomers: (customerId: string) => void,
    unselectCustomers: (customerId: string) => void,
    leaveSelectedCustomers: () => void
}

const useCustomerStore = create<ICustomerState>((set) => ({
    customerList: customerData?.db,
    deleteButtonText: "Müşteriyi Sil",
    selectedCustomersCount: 0,
    selectedCustomers: [],
    selectCustomers: (customerId: string) => set((state: ICustomerState) =>
    {
        if(state.selectedCustomersCount > 0){
            state.deleteButtonText = "Müşterileri Sil"
        }
        const newCustomerList = state.customerList?.filter((customer: TCustomer) => customer.customerId == customerId)
        return {
            selectedCustomersCount: state.selectedCustomersCount + 1,
            selectedCustomers: [...state.selectedCustomers || [], ...newCustomerList],
        }
    }),

    unselectCustomers: (customerId: string) => set((state: ICustomerState) =>
    {

        if(state.selectedCustomersCount == 2){
            state.deleteButtonText = "Müşteriyi Sil"
        }

        return {
            selectedCustomersCount: state.selectedCustomersCount - 1,
            selectedCustomers: state.selectedCustomers?.filter((customer: TCustomer) => customer.customerId !== customerId)
        }
    }),

    leaveSelectedCustomers: () => set((state:ICustomerState) =>
        ({
            selectedCustomersCount: 0,
            selectedCustomers: []
        })),
}))

export {
    useCustomerStore,
}