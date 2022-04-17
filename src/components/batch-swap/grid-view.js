import styles from './batch-swap.module.css';

const GridView = ({objkts, toggleObjkt, selectedObjkts, handleObjktChange}) =>
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
                    <div className={styles.objktInfo}>
                        <h2 className={styles.title}>
                            <a href={`https://teia.art/objkt/${objkt.id}`} target="_blank" rel="noreferrer">
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
                            <a href={`https://teia.art/tz/${objkt.creator_id}`} target="_blank" rel="noreferrer">
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
                        >Swappable {objkt.totalPossessed}</p>
                        {objkt.floor &&
                        <p
                            className={[
                                styles.text,
                                styles.marginBottom].join(' ')}
                        >Floor&nbsp;{objkt.floor}ꜩ</p>}
                        {objkt.tradeData && <p className={styles.text}>
                            Min&nbsp;{objkt.tradeData.min}ꜩ
                            Max&nbsp;{objkt.tradeData.max}ꜩ
                            <br/>
                            Last&nbsp;{objkt.tradeData.last}ꜩ
                            Avg&nbsp;{objkt.tradeData.average}ꜩ
                        </p>}
                    </div>
                    <p>
                        <button
                            onClick={toggleObjkt(objkt)}
                            className={styles.selectButton}
                        >{
                            objkt.id in
                            selectedObjkts
                                ? 'Deselect'
                                : 'Select'
                        }</button>
                    </p>
                    {objkt.id in selectedObjkts && <div>
                        <p>
                            <label htmlFor={`${objkt.id}Xtz`}>xtz</label>
                            <input
                                id={`${objkt.id}Xtz`}
                                type="number"
                                min={0.000001}
                                value={selectedObjkts?.[objkt.id].xtz}
                                onChange={handleObjktChange('xtz', objkt)}
                            />
                        </p>
                        <p>
                            <label htmlFor={`${objkt.id}Amount`}>Amount</label>
                            <input
                                id={`${objkt.id}Amount`}
                                type="number"
                                min={1}
                                max={objkt.totalPossessed}
                                value={selectedObjkts?.[objkt.id].amount}
                                onChange={handleObjktChange('amount',
                                    objkt)}
                            />
                        </p>
                    </div>}
                </div>
            </div>
        ))}
    </div>;

export default GridView;
