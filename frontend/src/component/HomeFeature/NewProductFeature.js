import React from 'react';
import ItemProduct from '../Product/ItemProduct';
import HeaderContent from '../Content/HeaderContent';
function NewProductFeature(props) {

    return (
        <section className="new_product_area section_gap_top section_gap_bottom_custom">
            <div className="container">
                <HeaderContent mainContent={props.title}
                    infoContent={props.description}
                    className="product-header-content" />
                <div className="row animate__animated animate__fadeIn">
                    <div className="col-lg-12 mt-5 mt-lg-0">
                        <div className="row product-grid">
                            {props.data && props.data.length > 0 &&
                                props.data.map((item, index) => {
                                    return (
                                        <ItemProduct 
                                            key={item.id}
                                            id={item.id} 
                                            type="col-lg-3 col-md-3" 
                                            name={item.name} 
                                            img={item.image}
                                            price={item.originalPrice} 
                                            discountPrice={item.discountPrice}
                                            className="product-item-hover"
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default NewProductFeature;