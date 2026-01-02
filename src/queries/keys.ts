import type { DarfToUpdateI } from "@/interfaces/darf.interface"
import type { OrderCreate, OrderToUpdate } from "@/interfaces/order.interface"
import type { TradeModality } from "@/interfaces/orderBreakdown.interface"
import type { RecommendedAssetCreate, RecommendedAssetUpdatePlannedPercentage } from "@/interfaces/recommendedAsset.interface"

export const orderKeys = {
    all: ['orders'],
    list: () => [...orderKeys.all],
    getByUserIdAndYear: (year :number) => [...orderKeys.all, "listOrdersByYear", year],
    listByMonth: (year :number, month :number) => [...orderKeys.all, 'listByMonth', year, month] as const,
    create: (order :OrderCreate)=> [...orderKeys.all, "create", order.userId] as const,
    delete: (id :string | undefined) => [...orderKeys.all, "delete", id] as const,
    update: (orderToUpdate :OrderToUpdate)=> [...orderKeys.all, "update", orderToUpdate.id] as const
}

export const assetKeys = {
    all: ['assets'],
    list: () => [...assetKeys.all],
    validadeAssetSymbol: (symbol :string) => [...assetKeys.all, "validateAssetSymbol", symbol]
}

export const recommendedAssetKeys = {
    all: ['recommendedAssets'],
    list: () => [...recommendedAssetKeys.all],
    create: (recommendedAsset :RecommendedAssetCreate)=> [...recommendedAssetKeys.all, 'create', recommendedAsset.userId] as const,
    delete: (id :string) => [...recommendedAssetKeys.all, "delete", id] as const,
    updatePlannedPercentage: (recommendedAssetUpdatePlannedPercentage :RecommendedAssetUpdatePlannedPercentage) => [...recommendedAssetKeys.all, "updatePlannedPercentage", recommendedAssetUpdatePlannedPercentage.id] as const
}

export const portifolioKeys = {
    all: ["portifolio"],
    list: () => [...portifolioKeys.all]
}

export const taxesKeys = {
    all: ["taxes"],
    list: (year :number | undefined, month :number | undefined, modality :TradeModality) => [...taxesKeys.all, "taxesInfo", [year, month, modality]]
}

export const planningKeys = {
    all: ["planning"],
    list: (investment :number) => [...planningKeys.all, "planningInfo", investment]
}

export const darfKeys = {
    all: ["darf"],
    list: () => [...darfKeys.all, "listDarfs"],
    getByUserIdAndYear: (year :number) => [...darfKeys.all, "listDarfsByYear", year],
    create: (selectedYear :number, selectedMonth :number, tradeModality :TradeModality) => [...darfKeys.all, 'create', selectedYear, selectedMonth, tradeModality] as const,
    delete: (id :string) => [...darfKeys.all, "delete", id] as const,
    update: (darfToUpdate :DarfToUpdateI)=> [...darfKeys.all, "update", darfToUpdate.id] as const,
    cancelPagamento: (id :string)=> [...darfKeys.all, "cancelPagamento", id] as const
}

export const processFiscalResultKeys = {
    all: ["processFiscalResult"],
    create: (selectedYear :number, selectedMonth :number, tradeModality :TradeModality) => [...processFiscalResultKeys.all, 'create', selectedYear, selectedMonth, tradeModality] as const,
}

export const compensationKeys = {
    all: ["compensation"],
    list: () => [...compensationKeys.all, "listCompensations"],
    getByUserIdAndYear: (year :number) => [...compensationKeys.all, "listCompensationsByYear", year],
    delete: (id :string) => [...compensationKeys.all, "delete", id] as const,
}