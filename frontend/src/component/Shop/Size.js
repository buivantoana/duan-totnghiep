import React, { useState, useEffect } from 'react';
import sizeService from '../../services/size';

function Size(props) {
    const [activeSizeName, setActiveSizeName] = useState('');
    const [arrSize, setArrSize] = useState([]);

    const handleClickSize = (sizeName) => {
        props.handleRecevieDataSize(sizeName != 0 ? sizeName : "ALL");
        setActiveSizeName(sizeName);
    };

    useEffect(() => {
        const fetchSize = async () => {
            let res = await sizeService.getAllSizes();
            if (res && res.length > 0) {
                const allOption = {
                    id: 0,
                    name: 'ALL',
                };
                const newSizes = [allOption, ...res];
                setArrSize(newSizes);
            }
        };
        fetchSize();
    }, []);

    return (
        <aside className="left_widgets p_filter_widgets">
            <div className="l_w_title">
                <h3>Kích cỡ</h3>
            </div>
            <div className="widgets_inner">
                <ul className="list">
                    {arrSize.map((item, index) => (
                        <li
                            key={index}
                            className={item.id === activeSizeName ? 'active' : ''}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleClickSize(item.id)}
                        >
                            <a>{item.name === 'ALL' ? 'Tất cả' : item.name}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}

export default Size;
