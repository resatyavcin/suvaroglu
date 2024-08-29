"use client"

import {useEffect, useState} from "react";

import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";
import {columns} from "@/components/customer/customer-columns";

import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import {useCustomerStore} from "@/store";
import {useLongPress} from "@uidotdev/usehooks";
import {useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import CustomerFilterForm from "@/components/customer/customer-filter-form";
import {Separator} from "@/components/ui/separator";


const CustomerTable = ({isOpen}: any) => {
    const {customerList, selectedCustomersCount, setIsSelectableCustomers, isSelectableCustomers} = useCustomerStore();
    const [filterValues, setFilterValues] = useState({})
    const query = useQuery({
        queryKey: ['customerList', filterValues],
        queryFn: async ({queryKey}: any) => {

            const url = `${process.env.NEXT_PUBLIC_API_URL}/folder?customerName=${queryKey[1]?.customerName ? queryKey[1]?.customerName : "" }&customerSurname=${queryKey[1].customerSurname ? queryKey[1]?.customerSurname : ""}`

            const data = await fetch(url);
            return data.json();
        },
    })


    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const {selectCustomers, unselectCustomers} = useCustomerStore();


    const router = useRouter();

    const attrs = useLongPress(
        () => {
            setIsSelectableCustomers(true);
        },
        {
            onStart: (event) => console.log("Press started"),
            onFinish: (event) => console.log("Press Finished"),
            onCancel: (event) => console.log("Press cancelled"),
            threshold: 500,
        }
    );

    const table = useReactTable({
        data: query.isSuccess && query.data.data as any,
        columns: columns(selectCustomers, unselectCustomers, isSelectableCustomers),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    useEffect(() => {
        if (isOpen && selectedCustomersCount === 0) {
            setIsSelectableCustomers(false)
        }
    }, [isOpen]);


    const handleRouteCustomerViewPage = (customerId: string) => {
        router.push(`/customer/customer-detail/${customerId}`);
    }


    return (
        <div>
            <CustomerFilterForm setFilterValues={setFilterValues} refetch={query.refetch()}/>

            <h2 className={"font-bold text-sm my-2 mx-4"}>Son 30 Müşteri</h2>
            <Separator/>
            <Table>
                <TableBody>
                    {query.isSuccess && table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                onClick={() => handleRouteCustomerViewPage(row.original.id)}
                                key={row.original.id}
                                data-state={row.getIsSelected() && "selected"}
                                className="custom-no-select"
                                {...attrs}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                Sonuç bulunamadı.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>

            </Table>

        </div>
    );
};

export default CustomerTable;

