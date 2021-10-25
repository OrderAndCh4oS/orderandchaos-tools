import styles from './utility-menu.module.css';
import useView from '../../hooks/use-view';
import useObjkts from '../../hooks/use-objkts';

const UtilityMenu = () => {
    const {handleViewSelect} = useView();
    const {handleSelectObjktSort} = useObjkts();

    return (
        <div className={styles.menuHolder}>
            <div className={styles.marginBottom}>
                <label htmlFor="sortOn">Sort On</label>
                <select
                    onChange={handleSelectObjktSort}
                    id="sortOn"
                    defaultValue={'id-desc'}
                >
                    <option value={'id-desc'}>Objkt ID (desc)</option>
                    <option value={'id-asc'}>Objkt ID (asc)</option>
                    <option value={'floor-desc'}>Floor (desc)</option>
                    <option value={'floor-asc'}>Floor (asc)</option>
                    <option value={'last-desc'}>Last (desc)</option>
                    <option value={'last-asc'}>Last (asc)</option>
                    <option value={'avg-desc'}>Avg (desc)</option>
                    <option value={'avg-asc'}>Avg (asc)</option>
                    <option value={'creator'}>Creator</option>
                </select>
            </div>
            <div>
                <label htmlFor="view">View</label>
                <select
                    onChange={handleViewSelect}
                    id="view"
                    defaultValue={'grid'}
                >
                    <option value={'grid'}>Grid</option>
                    <option value={'list'}>List</option>
                </select>
            </div>
        </div>
    )
}

export default UtilityMenu;
