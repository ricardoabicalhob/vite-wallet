import { AssetLogo } from "./asset-logo";
import { MoedaEmReal } from "./moeda-percentual";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import type { TaxesI } from "@/interfaces/taxes.interface";

interface TableTaxesProps {
    taxesInfo :TaxesI
}

export function TableTaxes({
    taxesInfo,
} :TableTaxesProps) {

    return(
        <Table>
            <TableCaption>{`${taxesInfo.ativosConsolidados.length === 0 ? 'Nenhuma venda realizada no período' : 'Vendas realizadas no período'}`}</TableCaption>
            <TableHeader className="sticky top-0 bg-my-background z-10">
                <TableRow>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Ativo</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Código</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Quantidade</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Taxas</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">IRRF</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center w-[10%] whitespace-normal">Receita bruta</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center w-[10%] whitespace-normal">Receita líquida operacional</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center w-[10%] whitespace-normal">Receita líquida contábil</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center w-[10%] whitespace-normal">Custo de aquisição</TableHead>
                    <TableHead className="text-my-foreground-secondary text-xs font-normal opacity-60 text-center">Ganho de capital</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {taxesInfo?.ativosConsolidados
                    .map(ativo => (
                        <TableRow key={ativo.symbol}>
                            <TableCell className="text-my-foreground-secondary">
                                <AssetLogo
                                    src={ativo.logoUrl}
                                    className="w-6 h-6 justify-self-center"
                                    iconSize={18}
                                />
                            </TableCell>
                            <TableCell className="text-my-foreground-secondary text-left tabular-nums">{ativo.symbol}</TableCell>
                            <TableCell className="text-my-foreground-secondary text-right tabular-nums">{ativo.quantidadeTotal}</TableCell>
                            <TableCell className="text-my-foreground-secondary text-right tabular-nums"><MoedaEmReal centavos={ativo.totalDeTaxasEmCentavos} /></TableCell>
                            <TableCell className="text-my-foreground-secondary text-right tabular-nums"><MoedaEmReal centavos={ativo.totalIRRFEmCentavos} /></TableCell>
                            <TableCell className="text-my-foreground-secondary text-right tabular-nums"><MoedaEmReal centavos={ativo.receitaBrutaTotalEmCentavos} /></TableCell>
                            <TableCell className="text-my-foreground-secondary text-right tabular-nums"><MoedaEmReal centavos={ativo.receitaLiquidaOperacionalTotalEmCentavos} /></TableCell>
                            <TableCell className="text-my-foreground-secondary text-right tabular-nums"><MoedaEmReal centavos={ativo.receitaLiquidaContabilTotalEmCentavos} /></TableCell>
                            <TableCell className="text-my-foreground-secondary text-right tabular-nums"><MoedaEmReal centavos={ativo.custoDeAquisicaoTotalEmCentavos} /></TableCell>
                            <TableCell className="text-my-foreground-secondary text-right tabular-nums"><MoedaEmReal centavos={ativo.ganhoDeCapitalTotalEmCentavos} /></TableCell>
                        </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}