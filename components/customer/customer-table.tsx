"use client"

import {useEffect, useState} from "react";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {columns} from "@/components/customer/customer-columns";

import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel, SortingState,
    useReactTable, VisibilityState,
} from "@tanstack/react-table"
import {useCustomerStore} from "@/store";
import { useLongPress } from "@uidotdev/usehooks";


const CustomerTable = ({isOpen}:any) => {
    const { customerList, selectedCustomersCount, setIsSelectableCustomers, isSelectableCustomers } = useCustomerStore();
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const { selectCustomers, unselectCustomers } = useCustomerStore();

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
        data: customerList,
        columns: columns(selectCustomers, unselectCustomers, isSelectableCustomers, selectedCustomersCount),
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
    })

    useEffect(() => {
        if(isOpen && selectedCustomersCount === 0){
            setIsSelectableCustomers(false)
        }
    }, [isOpen]);

    return (
        <Table>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                            {...attrs}
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            className="custom-no-select"
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
    );
};

export default CustomerTable;