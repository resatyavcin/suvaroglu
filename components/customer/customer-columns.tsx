'use client';

import { ColumnDef } from '@tanstack/react-table';
import { TCustomer } from '@/constants';
import { Checkbox } from '@/components/ui/checkbox';
import { MdContactPage } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import Link from 'next/link';
import { FaUserEdit } from 'react-icons/fa';
import { FaPhone } from 'react-icons/fa6';

type TCustomerColumn = (
  selectCustomers: (customer: string) => void,
  unselectCustomers: (customer: string) => void,
  isSelectable: boolean
) => ColumnDef<any>[];

export const columns: TCustomerColumn = (
  selectCustomers,
  unselectCustomers,
  isSelectable
) => [
  {
    id: 'id',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-3">
          {isSelectable && (
            <Checkbox
              className="w-6 h-6 rounded-full"
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                row.toggleSelected(!!value);
                if (value) {
                  selectCustomers(row.original.id);
                  return;
                }
                unselectCustomers(row.original.id);
              }}
              aria-label="Select row"
            />
          )}
          <div className={'w-full flex items-center justify-between'}>
            <div>
              <h2 className="font-bold">{row.original.header}</h2>
              <p>{row.original.description} KM</p>
            </div>
            <div>
              <a href={`tel:${row.original.phone}`}>
                <Button variant={'ghost'}>
                  <FaPhone className="w-4 h-4" />
                </Button>
              </a>

              <Link href={`/customer/customer-detail/${row.original.id}`}>
                <Button variant={'ghost'}>
                  <MdContactPage className="w-5 h-5" />
                </Button>
              </Link>

              <Link href={`/customer/customer-update/${row.original.id}`}>
                <Button variant={'ghost'}>
                  <FaUserEdit className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    },
  },
];
