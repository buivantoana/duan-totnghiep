import React, { useState, useEffect } from 'react';
import sizeService from '../../services/size';
import colorService from '../../services/color';

function Color(props) {
    const [activeColorName, setActiveColorName] = useState('');
    const [arrColor, setArrColor] = useState([]);

    const handleClickColor = (ColorName) => {
        props.handleRecevieDataColor(ColorName != 0 ? ColorName : "ALL");
        setActiveColorName(ColorName);
    };

    useEffect(() => {
        const fetchColor = async () => {
            let res = await colorService.getAllColor(true);
            if (res && res.length > 0) {
                const allOption = {
                    id: 0,
                    name: 'ALL',
                };
                const newColors = [allOption, ...res];
                setArrColor(newColors);
            }
        };
        fetchColor();
    }, []);

    return (
        <aside className="left_widgets p_filter_widgets">
            <div className="l_w_title">
                <h3>Màu</h3>
            </div>
            <div className="widgets_inner">
                <ul className="list">
                    {arrColor.map((item, index) => (
                        <li
                            key={index}
                            className={item.id === activeColorName ? 'active' : ''}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleClickColor(item.id)}
                        >
                            <a>{item.name === 'ALL' ? 'Tất cả' : item.name}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}

export default Color;
