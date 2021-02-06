import React from 'react';
import products from '../data';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';

const HomePage = () => {
    return (
     <>

        <h1>Latest Products</h1>
        <Row>
            {products.map(product => (
                <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product}/>
                </Col>
            ))};
        </Row>

     </>
    )
}


export default HomePage
