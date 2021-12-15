import styles from './batch-transfer.module.css';

const GridView = ({
                      objkts,
                      toggleObjkt,
                      selectedObjkts,
                      handleObjktChange,
                      handleAddRecipient,
                      handleRemoveRecipient
                  }) =>
    <div className={styles.grid}>
        {objkts && objkts.map(objkt => (
            <div key={objkt.id} className={styles.gridCell}>
                <div className={styles.cell}>
                    <div className={styles.imgHolder}>
                        <img
                            alt={objkt.title}
                            loading="lazy"
                            className={styles.img}
                            src={`https://orderandchaos.mypinata.cloud/ipfs/${objkt.display_uri.slice(
                                7)}`}
                        />
                    </div>
                    <div className={styles.objktInfo}>
                        <h2 className={styles.title}>
                            <a
                                href={`https://hicetnunc.art/objkt/${objkt.id}`}
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
                                styles.marginBottom
                            ].join(' ')}
                        >
                            <a
                                href={`https://hicetnunc.art/tz/${objkt.creator_id}`}
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
                        >Available {objkt.totalPossessed}</p>
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
                    {objkt.id in selectedObjkts &&
                    selectedObjkts
                        ?.[objkt.id]
                        .recipients
                        .map((r, i) => (
                            <div key={`selectedObjkt${objkt.id}${i}`}>
                                <p>
                                    <label htmlFor={`${objkt.id}Address${i}`}>Address</label>
                                    <input
                                        id={`${objkt.id}Address${i}`}
                                        value={r.address}
                                        onChange={handleObjktChange(
                                            'address',
                                            objkt.id,
                                            i
                                        )}
                                    />
                                </p>
                                <p>
                                    <label htmlFor={`${objkt.id}Amount${i}`}>Amount</label>
                                    <input
                                        id={`${objkt.id}Amount${i}`}
                                        type="number"
                                        min={1}
                                        max={objkt.totalPossessed}
                                        value={r.amount}
                                        onChange={handleObjktChange(
                                            'amount',
                                            objkt.id,
                                            i
                                        )}
                                    />
                                </p>
                                {i > 0
                                    ? (
                                        <p>
                                            <button
                                                onClick={handleRemoveRecipient(
                                                    objkt,
                                                    i
                                                )}
                                            >-
                                            </button>
                                        </p>
                                    ) : null}
                            </div>
                        ))}
                    {objkt.id in selectedObjkts &&
                    selectedObjkts?.[objkt.id].recipients.length <
                    objkt.totalPossessed && (
                        <p>
                            <button
                                onClick={handleAddRecipient(objkt)}
                            >+
                            </button>
                        </p>
                    )}
                </div>
            </div>
        ))}
    </div>;

export default GridView;
