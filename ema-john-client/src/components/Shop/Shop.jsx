import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const cart = useLoaderData()
    // const { count } = useLoaderData()
    const [count, setCount] = useState(0)
    console.log(count)
    const [numberOfItems, setnumberOfItems] = useState(10)
    const [currentPage, setCurrentpage] = useState(0)
    const numberOfPages = Math.ceil(count / numberOfItems)
    console.log(numberOfPages)
    const storedCart = getShoppingCart();
    const storedCartIds = Object.keys(storedCart)
    console.log(storedCartIds)
    const pages = [...Array(numberOfPages).keys()]
    console.log(pages)


    useEffect(() => {
        fetch('http://localhost:5000/productscount')
            .then(res => res.json())
            .then(data => setCount(data.count))
    }, [])
    const handleSelect = (e) => {
        const val = e.target.value
        setnumberOfItems(val)
        setCurrentpage(0)
    };

    const handlePrevious = () => {
        if (currentPage > 0) {
            setCurrentpage(currentPage - 1)
        }
    };
    const handleNext = () => {
        if (currentPage < pages.length) {
            setCurrentpage(currentPage + 1)
        }
    };
    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${currentPage}&size=${numberOfItems}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [currentPage, numberOfItems]);

    // useEffect(() => {

    //     const savedCart = [];
    //     // step 1: get id of the addedProduct
    //     for (const id in storedCart) {
    //         // step 2: get product from products state by using id
    //         const addedProduct = products.find(product => product._id === id)
    //         if (addedProduct) {
    //             // step 3: add quantity
    //             const quantity = storedCart[id];
    //             addedProduct.quantity = quantity;
    //             // step 4: add the added product to the saved cart
    //             savedCart.push(addedProduct);
    //         }
    //         // console.log('added Product', addedProduct)
    //     }
    //     // step 5: set the cart
    //     setCart(savedCart);
    // }, [products])

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            {console.log(currentPage)}
            <div className='pagination'>
                <button onClick={handlePrevious}>Prev</button>
                {pages.map(page => <button
                    className={page === currentPage ? 'selected' : ''}
                    key={page} onClick={() => setCurrentpage(page)}>{page + 1}</button>)}
                <select name="pages" onChange={handleSelect} defaultValue={10} id="">
                    <option value="5">5</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                </select>
                <button onClick={handleNext}>Next</button>
            </div>
        </div>
    );
};

export default Shop;