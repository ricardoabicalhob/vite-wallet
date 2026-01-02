export interface Asset {
    assetSymbol :string,
    id :string,
}

export interface AssetPresenter {
    id :string
    assetSymbol :string
    userId :string
    quantidadeDeAcoesCompradas :number
    quantidadeDeAcoesVendidas :number
    quantidadeAtualDeAcoes :number
    precoMedioBrutoPagoNoAtivoEmCentavos :number
    precoMedioLiquidoPagoNoAtivoEmCentavos :number
    precoAtualDoAtivoEmCentavos: number
    posicaoAtualDoAtivoEmCentavos :number
    resultadoDoAtivoEmCentavos :number
    resultadoDoAtivoEmPercentual :string
    logoUrl :string
    shortName :string
    regularMarketTime :string
}

export interface ValidatedAssetSymbolPayload {
    symbol: string,
    shortName: string,
    logoUrl: string,
    regularMarketPrice: number
}