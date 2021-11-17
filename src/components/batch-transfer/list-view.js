import styles from './batch-transfer.module.css';


const ListView = ({objkts, toggleObjkt, selectedObjkts, handleObjktChange}) =>
    <div className={styles.list}>
        {objkts && objkts.map(objkt => (
            <div key={objkt.id} className={styles.row}>
                <div className={styles.listColumnSmall}>
                    <img
                        alt={objkt.title}
                        loading="lazy"
                        className={styles.listImg}
                        src={`https://cloudflare-ipfs.com/ipfs/${objkt.display_uri.slice(
                            7)}`}
                    />
                </div>
                <div className={styles.listColumnLarge}>
                    <h2 className={styles.title}>
                        <a href={`https://hicetnunc.art/objkt/${objkt.id}`} target="_blank" rel="noreferrer">
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
                        <a href={`https://hicetnunc.art/tz/${objkt.creator_id}`} target="_blank" rel="noreferrer">
                            {objkt.creator_id}
                        </a>
                    </p>
                </div>
                <div className={styles.listColumnMedium}>
                    <p
                        className={[
                            styles.text,
                            styles.marginBottom].join(' ')}
                    >Available {objkt.totalPossessed}</p>
                </div>
                {objkt.id in selectedObjkts && <>
                    <div className={styles.listColumn}>
                        <label htmlFor={`${objkt.id}Address`}>Address</label>
                        <input
                            id={`${objkt.id}Address`}
                            value={selectedObjkts?.[objkt.id].address}
                            onChange={handleObjktChange('address', objkt)}
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
