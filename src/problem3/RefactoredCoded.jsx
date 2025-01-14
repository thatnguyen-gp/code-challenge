interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
}

interface Prices {
    [currency: string]: number;
}

interface Props extends BoxProps {
}

const WalletPage: React.FC<Props> = (props: Props) => {
    const {children, ...rest} = props;

    // Custom hooks for balances and prices
    const balances = useWalletBalances();
    const prices: Prices = usePrices();

    // Priority assignment function
    const getPriority = (blockchain: string): number => {
        const priorities: { [key: string]: number } = {
            Osmosis: 100,
            Ethereum: 50,
            Arbitrum: 30,
            Zilliqa: 20,
            Neo: 20,
        };
        return priorities[blockchain] ?? -99;
    };

    // Filter, sort, and format balances
    const sortedBalances: FormattedWalletBalance[] = useMemo(() => {
        return balances
            .filter((balance) => getPriority(balance.blockchain) > -99 && balance.amount > 0)
            .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain))
            .map((balance) => ({
                ...balance,
                formatted: balance.amount.toFixed(2), // Format to 2 decimal places
            }));
    }, [balances]);

    // Create rows for rendering
    const rows = sortedBalances.map((balance) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
            <WalletRow
                className={classes.row}
                key={balance.currency} // Use currency as key
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        );
    });

    return <div {...rest}>{rows}</div>;
};
