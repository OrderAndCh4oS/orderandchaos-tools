import {gql} from 'graphql-request';
import gqlClient from '../gql/client';

export const priceToXtz = price => (price / 1000000)
    .toFixed(3)
    .replace(/0*$/, '')
    .replace(/\.$/, '');

const query = gql`
    query getObjktsByWallet($address: String!) {
        hic_et_nunc_token(
            where: {
                token_holders: {
                    quantity: {_gt: "0"},
                    holder_id: {_eq: $address}
                }
            },
            order_by: {id: desc}
        ) {
            id
            creator_id
            artifact_uri
            display_uri
            thumbnail_uri
            timestamp
            mime
            title
            description
            supply
            royalties
            token_holders {
                holder_id
                quantity
            }
            swaps(where: {status: {_eq: "0"}}, order_by: {price: asc}) {
                amount
                amount_left
                creator_id
                price
            }
            trades {
                timestamp
                amount
                swap {
                    price
                }
            }
        }
    }
`;

const getTotalPossessed = (tokenHolders, address) => tokenHolders
    .reduce((count, th) =>
            th.holder_id === address
                ? count + th.quantity
                : count
        , 0);

const getTradeData = trades => {
    let min = Infinity;
    let max = 0;
    let total = 0;
    let count = trades.length;
    trades = trades.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    for(const trade of trades) {
        if(trade.swap.price < min) min = trade.swap.price;
        if(trade.swap.price > max) max = trade.swap.price;
        total += trade.swap.price;
    }

    return {
        min: priceToXtz(min),
        max: priceToXtz(max),
        total: priceToXtz(total),
        average: priceToXtz(total / count),
        last: priceToXtz(trades?.[0].swap.price) || 0,
        count,
    };
};

const getFloor = swaps => priceToXtz(swaps.reduce((floor, s) => s.price < floor ? s.price : floor, Infinity));

const getObjktsByWallet = async(address) => {
    try {
        const response = await gqlClient.request(query, {address});
        return response.hic_et_nunc_token.map(objkt => ({
            ...objkt,
            totalPossessed: getTotalPossessed(objkt.token_holders, address),
            tradeData: objkt.trades.length ? getTradeData(objkt.trades) : null,
            floor: objkt.swaps.length ? getFloor(objkt.swaps) : null
        }));
    } catch(e) {
        console.log(e);
        return null;
    }
};

export default getObjktsByWallet;
