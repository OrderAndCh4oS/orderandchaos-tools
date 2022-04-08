import styles from './batch-swap.module.css';


const ListView = ({objkts, toggleObjkt, selectedObjkts, handleObjktChange}) =>
    <div className={styles.list}>
        {objkts && objkts.map(objkt => (
            <div key={objkt.id} className={styles.row}>
                <div className={styles.listColumnSmall}>
                    <img
                        alt={objkt.title}
                        loading="lazy"
                        className={styles.listImg}
                        src={`https://orderandchaos.mypinata.cloud/ipfs/${objkt.display_uri.slice(
                            7)}`}
                    />
                </div>
                <div className={styles.listColumnLarge}>
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
                </div>
                <div className={styles.listColumnMedium}>
                    <p
                        className={[
                            styles.text,
                            styles.marginBottom].join(' ')}
                    >Swappable {objkt.totalPossessed}</p>
                </div>
                <div className={styles.listColumnMedium}>
                    {objkt.floor && <p
                        className={styles.text}
                    >Floor&nbsp;{objkt.floor}ꜩ</p>}
                    <p className={styles.text}>
                        Royalties {objkt.royalties / 10}%
                    </p>
                </div>
                <div className={styles.listColumnMedium}>
                    {objkt.tradeData && <p className={styles.text}>
                        Min&nbsp;{objkt.tradeData.min}ꜩ
                        Max&nbsp;{objkt.tradeData.max}ꜩ
                        <br/>
                        Last&nbsp;{objkt.tradeData.last}ꜩ
                        Avg&nbsp;{objkt.tradeData.average}ꜩ
                    </p>}
                </div>
                {objkt.id in selectedObjkts && <>
                    <div className={styles.listColumn}>
                        <label htmlFor={`${objkt.id}Xtz`}>xtz</label>
                        <input
                            id={`${objkt.id}Xtz`}
                            type="number"
                            min={0.000001}
                            value={selectedObjkts?.[objkt.id].xtz}
                            onChange={handleObjktChange('xtz',
                                objkt)}
                        />
                    </div>
                    <div className={styles.listColumn}>
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
                    </div>
                </>
                }
                <div className={styles.marginLeftAuto}>
                    <p>
                        <button onClick={toggleObjkt(objkt)}>{
                            objkt.id in
                            selectedObjkts
                                ? 'Deselect'
                                : 'Select'
                        }</button>
                    </p>
                </div>
            </div>
        ))}
    </div>;

export default ListView;
