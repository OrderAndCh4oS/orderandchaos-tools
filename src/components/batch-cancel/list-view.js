import styles from './batch-cancel.module.css';
import {priceToXtz} from '../../api/get-swappable-objkts-by-wallet';

const ListView = ({objkts, toggleSwap, selectedSwaps}) =>
    <div className={styles.list}>
        {objkts && objkts.map(objkt => (
            <div key={objkt.id} className={styles.row}>
                <div className={styles.listColumnSmall}>
                    <img
                        alt={objkt.title}
                        loading="lazy"
                        className={styles.listImg}
                        src={`https://ipfs.io/ipfs/${objkt.display_uri.slice(
                            7)}`}
                    />
                </div>
                <div className={styles.listColumnLarge}>
                    <h2 className={styles.title}>
                        <a
                            href={`https://teia.art/objkt/${objkt.id}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            #{objkt.id} {objkt.title}
                        </a>
                    </h2>
                    {objkt.creator?.name &&
                    <p className={styles.text}>{objkt.creator.name}</p>}
                    <p
                        className={[
                            styles.text,
                            styles.marginBottom].join(' ')}
                    >
                        <a
                            href={`https://teia.art/tz/${objkt.creator_id}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {objkt.creator_id}
                        </a>
                    </p>
                </div>
                <div className={styles.listColumnMedium}>
                    <p
                        className={[
                            styles.text,
                            styles.marginBottom].join(' ')}
                    >Swapped {objkt.totalSwapped}</p>
                </div>
                <div className={styles.listColumnMedium}>
                    {objkt.floor && <p
                        className={styles.text}
                    >Floor&nbsp;{objkt.floor}???</p>}
                    <p className={styles.text}>
                        Royalties {objkt.royalties / 10}%
                    </p>
                </div>
                <div className={styles.listColumnMedium}>
                    {objkt.tradeData && <p className={styles.text}>
                        Min&nbsp;{objkt.tradeData.min}???
                        Max&nbsp;{objkt.tradeData.max}???
                        <br/>
                        Last&nbsp;{objkt.tradeData.last}???
                        Avg&nbsp;{objkt.tradeData.average}???
                    </p>}
                </div>
                <div className={styles.marginLeftAuto}>
                    {objkt.userSwaps?.map(swap => (
                        <p className={styles.swaps}>
                            {swap.amount_left} @ {priceToXtz(swap.price)}???{' '}
                            <button onClick={toggleSwap({objkt, swap})}>{
                                swap.id in selectedSwaps
                                    ? 'Deselect'
                                    : 'Select'
                            }</button>
                        </p>
                    ))}
                </div>
            </div>
        ))}
    </div>;

export default ListView;
