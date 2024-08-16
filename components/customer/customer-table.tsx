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
    const { customerList, selectedCustomersCount } = useCustomerStore();
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const { selectCustomers, unselectCustomers } = useCustomerStore();

    const [isSelectable, setIsSelectable] = useState<boolean>(false);
    const attrs = useLongPress(
        () => {
            setIsSelectable(true);
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
        columns: columns(selectCustomers, unselectCustomers,isSelectable, selectedCustomersCount),
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
            setIsSelectable(false)
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
                            No results.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default CustomerTable;