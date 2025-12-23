import type { DarfToUpdateI } from "@/interfaces/darf.interface"
import type { OrderCreate, OrderToUpdate } from "@/interfaces/order.interface"
import type { TradeModality } from "@/interfaces/orderBreakdown.interface"
import type { RecommendedAssetCreate, RecommendedAssetUpdatePlannedPercentage } from "@/interfaces/recommendedAsset.interface"

export const orderKeys = {
    all: ['orders'],
    list: () => [...orderKeys.all],
    getByUserIdAndYear: (userId :string, year :number) => [...orderKeys.all, "listOrdersByYear", userId, year],
    listByMonth: (userId :string, year :number, month :number) => [...orderKeys.all, 'listByMonth', userId, year, month] as const,
    create: (order :OrderCreate)=> [...orderKeys.all, "create", order.userId] as const,
    delete: (id :string | undefined) => [...orderKeys.all, "delete", id] as const,
    update: (orderToUpdate :OrderToUpdate)=> [...orderKeys.all, "update", orderToUpdate.id] as const
}

export const assetKeys = {
    all: ['assets'],
    list: () => [...assetKeys.all],
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
    list: (userId :string, year :number | undefined, month :number | undefined, modality :TradeModality) => [...taxesKeys.all, "taxesInfo", [userId, year, month, modality]]
}

export const planningKeys = {
    all: ["planning"],
    list: (userId :string, investment :number) => [...planningKeys.all, "planningInfo", userId, investment]
}

export const darfKeys = {
    all: ["darf"],
    list: (userId :string) => [...darfKeys.all, "listDarfs", userId],
    getByUserIdAndYear: (userId :string, year :number) => [...darfKeys.all, "listDarfsByYear", userId, year],
    create: (userId :string, selectedYear :number, selectedMonth :number, tradeModality :TradeModality) => [...darfKeys.all, 'create', userId, selectedYear, selectedMonth, tradeModality] as const,
    delete: (id :string) => [...darfKeys.all, "delete", id] as const,
    update: (darfToUpdate :DarfToUpdateI)=> [...darfKeys.all, "update", darfToUpdate.id] as const,
    cancelPagamento: (id :string)=> [...darfKeys.all, "cancelPagamento", id] as const
}

export const processFiscalResultKeys = {
    all: ["processFiscalResult"],
    create: (userId :string, selectedYear :number, selectedMonth :number, tradeModality :TradeModality) => [...processFiscalResultKeys.all, 'create', userId, selectedYear, selectedMonth, tradeModality] as const,
}

export const compensationKeys = {
    all: ["compensation"],
    list: (userId :string) => [...compensationKeys.all, "listCompensations", userId],
    getByUserIdAndYear: (userId :string, year :number) => [...compensationKeys.all, "listCompensationsByYear", userId, year],
    delete: (id :string) => [...compensationKeys.all, "delete", id] as const,
}