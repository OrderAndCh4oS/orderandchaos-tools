import {createContext, useState} from 'react';

export const ObjktsContext = createContext({});

const ObjktsProvider = ({children}) => {
    const [objkts, setObjkts] = useState();

    const handleSelectObjktSort = (event) => {
        switch(event.target.value) {
            case 'id-asc':
                setObjkts(
                    prevState => ([...prevState.sort((a, b) => a.id - b.id)]));
                break;
            case 'id-desc':
                setObjkts(
                    prevState => ([...prevState.sort((a, b) => b.id - a.id)]));
                break;
            case 'floor-asc':
                setObjkts(prevState => ([
                    ...prevState.sort((a, b) => a.floor - b.floor)]));
                break;
            case 'floor-desc':
                setObjkts(prevState => ([
                    ...prevState.sort((a, b) => b.floor - a.floor)]));
                break;
            case 'last-asc':
                setObjkts(prevState => ([
                    ...prevState.sort((a, b) =>
                        (a.tradeData?.last || -1) - (b.tradeData?.last || -1))
                ]));
                break;
            case 'last-desc':
                setObjkts(prevState => ([
                    ...prevState.sort((a, b) =>
                        (b.tradeData?.last || -1) - (a.tradeData?.last || -1))
                ]));
                break;
            case 'avg-asc':
                setObjkts(prevState => ([
                    ...prevState.sort((a, b) =>
                        (a.tradeData?.avg || -1) - (b.tradeData?.avg || -1))
                ]));
                break;
            case 'avg-desc':
                setObjkts(prevState => ([
                    ...prevState.sort((a, b) =>
                        (b.tradeData?.avg || -1) - (a.tradeData?.avg || -1))
                ]));
                break;
            case 'creator':
                setObjkts(prevState => ([
                    ...prevState.sort(
                        (a, b) => a.creator_id.localeCompare(b.creator_id))]));
                break;
            default:
                console.log('Unhandled type');
        }
    };

    return (
        <ObjktsContext.Provider
            value={{
                objkts,
                setObjkts,
                handleSelectObjktSort
            }}
        >
            {children}
        </ObjktsContext.Provider>
    );
};

export default ObjktsProvider;
