import styles from './batch-cancel.module.css';
import {priceToXtz} from '../../api/get-swappable-objkts-by-wallet';

const GridView = ({objkts, toggleSwap, selectedSwaps}) =>
    <div className={styles.grid}>
        {objkts && objkts.map(objkt => (
            <div key={objkt.id} className={styles.gridCell}>
                <div className={styles.cell}>
                    <div className={styles.imgHolder}>
                        <img
                            alt={objkt.title}
                            loading="lazy"
                            className={styles.img}
                            src={`https://ipfs.io/ipfs/${objkt.display_uri.slice(7)}`}
                        />
                    </div>
                    <div className={styles.marginBottom}>
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
                        <p className={styles.text}>
                            Royalties {objkt.royalties / 10}%
                        </p>
                        <p
                            className={[
                                styles.text,
                                styles.marginBottom].join(' ')}
                        >Swapped {objkt.totalSwapped}</p>
                        {objkt.floor &&
                        <p
                            className={[
                                styles.text,
                                styles.marginBottom].join(' ')}
                        >Floor&nbsp;{objkt.floor}???</p>}
                        {objkt.tradeData && <p className={styles.text}>
                            Min&nbsp;{objkt.tradeData.min}???
                            Max&nbsp;{objkt.tradeData.max}???
                            <br/>
                            Last&nbsp;{objkt.tradeData.last}???
                            Avg&nbsp;{objkt.tradeData.average}???
                        </p>}
                    </div>
                    {objkt.userSwaps?.map(swap => (
                        <p key={swap.id} className={styles.swaps}>
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

export default GridView;
