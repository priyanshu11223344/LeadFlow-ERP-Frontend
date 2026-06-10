import { useQuery }
from "@tanstack/react-query";

import {
  getSalesReport,
  getInventoryReport,
  getRevenueReport,
  getProcurementReport,
} from "./reportAPI";

export const useSalesReport =
  () =>
    useQuery({
      queryKey: [
        "salesReport",
      ],
      queryFn:
        getSalesReport,
    });

export const useInventoryReport =
  () =>
    useQuery({
      queryKey: [
        "inventoryReport",
      ],
      queryFn:
        getInventoryReport,
    });

export const useRevenueReport =
  () =>
    useQuery({
      queryKey: [
        "revenueReport",
      ],
      queryFn:
        getRevenueReport,
    });

export const useProcurementReport =
  () =>
    useQuery({
      queryKey: [
        "procurementReport",
      ],
      queryFn:
        getProcurementReport,
    });