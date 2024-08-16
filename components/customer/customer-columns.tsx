"use client"

import {ColumnDef} from "@tanstack/react-table";
import {TCustomer} from "@/constants";
import {Checkbox} from "@/components/ui/checkbox";

export const columns: ColumnDef<TCustomer>[] = [
    {
        id: "customerId",

        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-x-3">
                    <Checkbox
                        className="w-6 h-6 rounded-full"
                        //checked={row.getIsSelected()}
                        //onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                    <div>
                        <h2 className="font-bold">
                            {row.original.customerName + ' ' + row.original.customerSurname}
                        </h2>
                        <p>
                            {row.original.customerVehicle + ' • ' + new Intl.NumberFormat('tr-TR', { style: "decimal" }).format(
                                row.original.customerVehicleKM)
                            } KM
                        </p>
                    </div>
                </div>
            )
        }
    }
]
