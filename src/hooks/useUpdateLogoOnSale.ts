import { useEffect } from "react"

export function useUpdateLogoOnSale(
    operationType: "Compra" | "Venda",
    assetSymbol: string | undefined,
    assetsForSale: Record<string, string>,
    setAssetLogourl: (url: string) => void,
) {
    useEffect(() => {
        if (operationType === "Venda" && assetSymbol) {
            setAssetLogourl(assetsForSale[assetSymbol] || "")
            return
        }
        if (!assetSymbol) {
            setAssetLogourl("")
        }
    }, [operationType, assetSymbol])
}
